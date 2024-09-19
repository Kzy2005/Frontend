// export default function Home(){
//   return(
//     <> Home page</>
//   )
// }

import { useState,useEffect } from "react";
import ProductItem from "./components/ProductItem";
// import ProductDetail from "./components/ProductDetail";
import { Link , Navigate} from "react-router-dom";
import './Home.css';

export default function Home() {
  const [productTypes, setProductTypes]=useState([]);  //เก็บประเภทสินค้าทั้งหมดเป็นarray
  const [productTypeId,setProductTypeId]=useState(0);   //เก็บรหัสผ่าน
  const [products, setProducts] = useState([]);  //เก็บข้อมูลสินค้า
  const [cart, setCart] = useState([]); // เก็บรายการสินค้าในตะกร้า
  const [totalPrice, setTotalPrice] = useState(0); // เก็บยอดรวมเงินทั้งหมดในตะกร้า
  const [paymentAmount, setPaymentAmount] = useState(0); // เก็บจำนวนเงินที่ใช้จ่าย

useEffect(()=>{
  async function fetchData() {
    const response = await fetch(
        "http://localhost:3000/api/product_types",
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    );

    let json = await response.json();
    setProductTypes(json.data);
}

fetchData();
},[]);

useEffect(() => {
  async function fetchData() {
    const response = await fetch(
      "http://localhost:3000/api/products/type/" + productTypeId,
      {
        medthod:"GET",
        headers:{
          Accept:"application/json",
          'Content-Type': 'application/json',
          Authorization: "Bearer " + localStorage.getItem("access_token")        
        }
      }
    );

    let json = await response.json();
    setProducts(json.data);
    // console.log ("test20");
    // console.log(json.data);
  }

  fetchData();
}, [productTypeId]);

// ฟังก์ชันที่ใช้ในการเพิ่มสินค้าเข้าสู่ตะกร้า
const addToCart = (product) => {
  const updatedCart = [...cart, product];
  setCart(updatedCart);
  calculateTotalPrice(updatedCart);
};

// ฟังก์ชันที่ใช้ในการลบสินค้าออกจากตะกร้า
const removeFromCart = (index) => {
  const updatedCart = [...cart];
  updatedCart.splice(index, 1);
  setCart(updatedCart);
  calculateTotalPrice(updatedCart);
};

// ฟังก์ชันที่ใช้ในการคำนวณยอดรวมเงินทั้งหมดในตะกร้า
const calculateTotalPrice = (cart) => {
  const totalPrice = cart.reduce((total, product) => total + product.price, 0);
  setTotalPrice(totalPrice);
};

// ฟังก์ชันที่ใช้ในการจ่ายเงิน
const makePayment = () => {
  if (paymentAmount >= totalPrice) {
    alert("ชำระเงินสำเร็จ!");
    setCart([]);
    setTotalPrice(0);
  } else {
    alert("จำนวนเงินไม่เพียงพอ");
  }
};


  if (localStorage.getItem("access_token")) {
    console.log(localStorage.getItem("access_token"));

    return (
      <><div className="a"><header className="header">
        <Link to={`/page`}>หน้าแรก</Link>
        <a><Link to={`/`}>Log out</Link></a>
        </header>
  <div className="container mb-5">
        <h1> เชิญชมและรับเลือกเลยน่าา ^_^</h1>
        <p>กรุณาเลือกประเภทสินค้าได้ที่นี้</p>
        <select className="form-select mb-3" value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
          <option value={0}>ทุกประเภทสินค้า</option>
          {productTypes.map((item) => (
            <option key={item.product_type_id} value={item.product_type_id}>
              {" "}
              {item.product_type_name}{" "}
            </option>
          ))}
        </select>

        <Link to={"/products/add"}className="btn btn-outline-primary me-3 mb-3">
          เพิ่ม
        </Link>

        <div className="row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 400px)", justifyContent: "center" }}>
          {products.map((item) => (
            <div key={item.product_id} className="col m-1">
              <ProductItem data={item} addToCart={addToCart} />
            </div>
          ))}
        </div>

        {/* แสดงตะกร้าสินค้าและยอดรวมเงิน */}
        <div className="d">
        <h2>ตะกร้าสินค้า</h2>
        <ul>
          {cart.map((product, index) => (
            <li key={index}>
              {product.product_name} - {product.price}
              <button className="c" onClick={() => removeFromCart(index)}>ลบ</button>
            </li>
          ))}
        </ul>
        <p>ยอดรวมเงิน: {totalPrice}</p>
        <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
        <button onClick={makePayment}>ชำระเงิน</button>
      </div></div>
      </div></>
    );
  }

  return (
    <Navigate to="/" replace/>
  );
}