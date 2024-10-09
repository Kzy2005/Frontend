// const http = require('http');
// const hostname = '127.0.0.1';
// const port = 8080;

// const server = http.createServer((req,res)=>{
//   res.statusCode=200;
//   res.setHeader('Content-Type','text/plain');
//   res.end('Hello World Uncle')
// });

// server.listen(port,hostname,() => {
//   console.log(`Server running at http://${hostname} " ${port}/`)
// });

const express = require('express');
const app = express();
const port= 8080;

const Product = require("./libs/Product");

const jwt = require("jsonwebtoken");

// const bodyParser=require('body-parser');
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

const bodyParser=require('body-parser');
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/images', express.static('images'));



var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:10,
  host:'localhost',
  user:'root',
  password:'',
  database:'my-product'
});

app.get('/',(req,res)=>{
  res.send('Hellow world by express');
});

app.get('/products',(req, res) => {
  pool.query("SELECT * FROM products", function(error, results, fields){
      if (error) throw error;

      res.json(results);
  });
});

app.get('/users',(req,res)=>{
  // res.send("Gettin all users to you");
  pool.query('select * from users',function(error,results,fields){
  if (error) throw error;
  res.json(results);
});
});

app.get('/user/:userId',(req,res)=>{
  const userId=req.params.userId;
  pool.query('select * from users where user_id = ?',[userId],function(error,results,fields){
  if (error) throw error;
  res.json(results);
});
});


// app.post('/add_user',(req,res)=>{
//   const input = req.body;
//   pool.query("insert into users(user_name,user_pwd,first_name,last_name,email) values(?,?,?,?,?)",
//   [
//     input.user_name,
//     input.user_pwd,
//     input.first_name,
//     input.last_name,
//     input.email
//   ],function(error,results,fields){
//     if(error) throw error;
//     res.json(results);
//   });
// });


app.post('/add_user',(req,res)=>{
  const input = req.body;
  
  pool.query("insert into users(user_name,user_pwd,first_name,last_name,email) values(?,md5(?),?,?,?)",
  [
    input.user_name,
    input.user_pwd,
    input.first_name,
    input.last_name,
    input.email
  ],function(error,results,fields){
  if (error) throw error;
  res.json(results);
});
});

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  // console.log("abc");
  pool.query("select * from users where user_name = ? and user_pwd = md5(?)",[username,password],function(error,results,fields){
    if (error) {
      res.json({
        result:false,
        message:error.message
      });
    }
    if (results.length){
      res.json({
        result:true
      });
    } else {
      res.json({
        result:false,
        message:"ไม่พบ Username หรือ Password ไม่ถูกต้อง"
      });
    }
  });
});


app.listen(port,()=>{
  console.log(`Example app istening on port ${port}`)
});

app.post("/api/authen_request",(req, res) => {
  const sql = "SELECT * FROM users WHERE MD5(user_name) = ?";
  pool.query(sql, [req.body.username], (error, results) => {
      var response;
      if (error) {
        response = {
          result: false,
          message: error.message
        };
      }else {
        if (results.length) {
          var payload = { username: req.body.username };
          var secretKey = "MySecretKey";
          const authToken = jwt.sign(payload, secretKey);
          response = {
            result: true,
            data: {
              auth_token: authToken
          }
        };
        }else {
          response = {
            result: false,
            message: "Username ไม่ถูกต้อง"
          };
        }
      }

    res.json(response);
  });

});

app.post("/api/access_request",  (req, res) => {
  const authenSignature = req.body.auth_signature;
  const authToken = req.body.auth_token;

  var decoded = jwt.verify(authToken, "MySecretKey");

  if(decoded) {
    const query = "SELECT a.user_id, a.user_name, a.first_name, a.last_name, a.email, a.role_id, b.role_name "
                + "FROM users a JOIN roles b ON a.role_id = b.role_id WHERE MD5(CONCAT(user_name, '&', user_pwd)) = ?";
    pool.query(query, [authenSignature], (error, results) => {
          var response;
         if(error) {
           response = {
            result: false,
            message: error.message
          };
        } else {
          if (results.length) {
              var payload = {
                 user_id: results[0].user_id, username: results[0].username, first_name: results[0].first_name,
                  last_name: results[0].last_name, email: results[0].email,
                  role_id: results[0].role_id, role_name: results[0].role_name

                   };
               const accessToken = jwt.sign(payload, "MySecretKey");
                  response = { result: true, data: { access_token: accessToken, account_info: payload } };
              }else {
                  response = { result: false, message: "Username หรือ Password ไม่ถูกต้อง" };
                }
                }
              res.json(response);
           });
       }
});
let checkAuth = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
    console.log('1111');
    console.log(token);
    console.log('1111');
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }
  console.log(req.headers);
  console.log(token);

  if (token) {
    jwt.verify(token, "MySecretKey", (error, decoded) => {
      if (error) {
        console.log('bb');
        console.log(error);
        res.send(JSON.stringify({
          result: false,
          message: "ไม่ได้เข้าสู่ระบบ"
        }));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).sent("Not authorized");
  }
}

app.get("/api/product_types", checkAuth, (req, res) => {
  const query = "SELECT * FROM product_types";

  pool.query(query, (error, results) => {
    if (error) {
      res.json({
        result: false,
        message: error.message
      })
    } else {
      res.json({
        result: true,
        data: results
      });
    }
  });
});

app.get("/api/products/type/:productTypeId", checkAuth, (req,res) => {
  const productTypeId = req.params.productTypeId;
  const sql = "SELECT a.*, b.product_type_name "
  + "FROM products a "
  + "JOIN product_types b ON a.product_type_id = b.product_type_id ";

  if (productTypeId == 0) {
    pool.query(sql, (error, results) => {
      if (error) {
        res.json({
          result: false,
          message: error.message
        });
      } else {
        res.json({
          result: true,
          data: results
        });
      }
    });
  } else {
    pool.query(sql + "WHERE a.product_type_id = ?",
    [productTypeId], (error, results) => {
      if (error) {
        res.json({
          result: false,
          message: error.message
        });
      } else {
        res.json({
          result: true,
          data: results
        });
      }
    });
  }
});

app.post("/api/products/add", async (req, res) => {
  const input = req.body;
  
  try {
    var result = await Product.createProduct(pool,
      input.product_name, input.product_type_id,
      input.price, input.stock);

      res.json({
        result: true
      });
  } catch (ex) {
    res.json({
      result: false,
      message: ex.message
    });
  }
  
});