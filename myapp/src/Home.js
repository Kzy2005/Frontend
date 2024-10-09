import { useState, useEffect } from "react";
import ProductItem from "./components/ProductItem";
import { Link, Navigate } from "react-router-dom";
import './Home.css';

export default function Home() {
  const [productTypes, setProductTypes] = useState([]);  // เก็บประเภทสินค้าทั้งหมด
  const [productTypeId, setProductTypeId] = useState(0); // เก็บรหัสประเภท
  const [products, setProducts] = useState([]);          // เก็บข้อมูลสินค้า
  const [cart, setCart] = useState([]);                  // เก็บรายการสินค้าในตะกร้า
  const [totalPrice, setTotalPrice] = useState(0);       // ยอดรวมเงินในตะกร้า
  const [paymentAmount, setPaymentAmount] = useState(0); // จำนวนเงินที่จ่าย
  const [description, setDescription] = useState("");    // เก็บคำบรรยายประเภทสินค้า

  // ฟังก์ชันที่ใช้ในการดึงข้อมูลประเภทสินค้า
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/api/product_types", {
        method: "GET",
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });
      let json = await response.json();
      setProductTypes(json.data);
    }
    fetchData();
  }, []);

  // ฟังก์ชันที่ใช้ในการดึงข้อมูลสินค้า
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/api/products/type/" + productTypeId, {
        method: "GET",
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });

      let json = await response.json();
      setProducts(json.data);

      // อัปเดตคำบรรยายตามประเภทสินค้า
      updateDescription(productTypeId);
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

  // ฟังก์ชันที่ใช้ในการอัปเดตคำบรรยายประเภทสินค้า
  const updateDescription = (typeId) => {
    // ตัวอย่างการอัปเดตคำบรรยาย สามารถแก้ไขตามข้อมูลที่ดึงมาจาก backend
    const descriptions = {
      1: "อาหารแห้ง หรือที่เรามักรู้จักกันว่า “อาหารเม็ด” เป็นอาหารที่ผ่านการอบหรือแปรรูปเพื่อให้มีความชื้นต่ำ (ประมาณ 6-10%) อาหารประเภทนี้มักมาในรูปของเม็ดกลมหรือสี่เหลี่ยม และสามารถเก็บรักษาได้ยาวนานกว่าประเภทอื่น เน้นการเสริมด้วยสารอาหารเสริม เช่น วิตามินและแร่ธาตุต่าง ๆ (เช่น วิตามิน A, D, E, สังกะสี และแคลเซียม)บางสูตรอาจมีการเพิ่มกรดไขมันโอเมก้า 3 และ 6 เพื่อช่วยบำรุงขนและผิวหนัง",
      2: "อาหารเปียกมีความชื้นสูง (ประมาณ 70-85%) โดยมาในรูปแบบกระป๋องหรือถุงอาหารแบบนิ่ม มักมีรสชาติที่สัตว์เลี้ยงชอบและมีความคล้ายคลึงกับอาหารธรรมชาติของสัตว์ มีการเสริมด้วยสารต้านอนุมูลอิสระ วิตามิน C และ E ซึ่งช่วยเสริมระบบภูมิคุ้มกันและอาหารเปียกมักมีการเสริมแร่ธาตุ เช่น แมกนีเซียมและโพแทสเซียม ซึ่งช่วยในการทำงานของกล้ามเนื้อและระบบประสาท",
      3: "อาหารกึ่งเปียกมีความชื้นประมาณ 25-35% ลักษณะเนื้ออาหารจะนุ่มกว่ารูปแบบเม็ด แต่ไม่เปียกเหมือนอาหารกระป๋อง อาหารกึ่งเปียกมักจะมีการเพิ่มสารต้านอนุมูลอิสระ วิตามิน A และ D เพื่อช่วยส่งเสริมระบบภูมิคุ้มกัน มักมีการเพิ่มสารเสริมเช่น ไฟเบอร์เพื่อช่วยในการย่อยอาหาร",
      4: "อาหารดิบประกอบด้วยเนื้อสัตว์ดิบ เช่น เนื้อไก่ เนื้อวัว และอวัยวะสัตว์ต่าง ๆ ไม่ผ่านการปรุงแต่งหรือแปรรูปใด ๆ เน้นการให้สารอาหารที่สดใหม่ เช่น เอ็นไซม์และสารต้านอนุมูลอิสระที่อยู่ในเนื้อดิบ กรดไขมันที่จำเป็นมาจากเนื้อสัตว์สดช่วยส่งเสริมสุขภาพขนและผิวหนัง",
      5: "อาหารบาร์ฟเป็นอาหารดิบที่ออกแบบมาเพื่อให้มีความสมดุลทางโภชนาการ ประกอบด้วยเนื้อดิบ กระดูก ผัก และผลไม้ อาหารบาร์ฟช่วยให้สัตว์เลี้ยงได้รับสารอาหารจากธรรมชาติที่ยังสดใหม่และมีการเสริมสารอาหารจากผักและผลไม้ที่ไม่ผ่านกระบวนการแปรรูป ช่วยในการบำรุงร่างกาย",
      6: "ขนมหรืออาหารเสริมถูกใช้เพื่อเป็นรางวัลหรือเพิ่มคุณค่าทางโภชนาการให้สัตว์เลี้ยง ขนมและอาหารเสริมบางอย่างช่วยเสริมการขัดฟัน ลดการเกิดคราบพลัค"
    };

    setDescription(descriptions[typeId] || "ประเภทอาหารสัตว์ในรูปแบบต่างๆทั้งหมด");
  };

  if (localStorage.getItem("access_token")) {
    return (
      <>
        <div className="a">
          <header className="header">
            <Link to={`/page`}>หน้าแรก</Link>
            <a><Link to={`/`}>Log out</Link></a>
          </header>
          <div className="container mb-5">
            <h1>เชิญชมและรับเลือกเลยน่าา ^_^</h1>
            <p>กรุณาเลือกประเภทอาหารสัตว์เลี้ยงได้ที่นี่</p>
            <select className="form-select mb-3" value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
              <option value={0}>อาหารทุกประเภท</option>
              {productTypes.map((item) => (
                <option key={item.product_type_id} value={item.product_type_id}>
                  {item.product_type_name}
                </option>
              ))}
            </select>

            {/* เพิ่มส่วนแสดงคำบรรยาย */}
            <div className="description">
              <h3>ข้อมูลประเภทอาหารสัตว์:</h3>
              <p>{description}</p>
            </div>

            <div className="row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 400px)", justifyContent: "center" }}>
              {products.map((item) => (
                <div key={item.product_id} className="col m-1">
                  <ProductItem data={item} addToCart={addToCart} />
                </div>
              ))}
            </div>
            
            <Link to={"/products/add"} className="btn btn-outline-primary me-3 mb-3">
              เพิ่ม
            </Link>

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
            </div>
          </div>
        </div>
      </>
    );
  }

  return <Navigate to="/" replace />;
}
