import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function ProductDetail() {
    let params = useParams();

    const [productName, setProductName] = useState("");
    const [productTypes, setProductTypes] = useState([]);
    const [productTypeId, setProductTypeId] = useState(0);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [validated, setValidated] = useState(false);
    const [productPrice, setProductPrice] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/product_types",
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
    }, []);

    const onSave = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (params.productId === "add") {
                doCreateProduct();
            } else {
                doUpdateProduct();
            }
        }

        setValidated(true);
    }

    // const doCreateProduct = async () => {
    //     const response = await fetch(
    //         "http://localhost:8080/api/products/add",
    //         {
    //             method: "POST",
    //             headers: {
    //                 Accept: "application/json",
    //                 'Content-Type': 'application/json',
    //                 Authorization: "Bearer " + localStorage.getItem("access_token")
    //             },
    //             body: JSON.stringify({
    //                 product_name: productName,
    //                 product_type_id: productTypeId,
    //                 price: price,
    //                 stock: stock
    //             })
    //         }
    //     );
    //     let json = await response.json();
    //     if (json.result) {
    //         window.location = "/home";
    //     }
    // };

    const doCreateProduct = async () => {
        const response = await fetch(
            "http://localhost:8080/api/products/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    price: price,
                    stock: stock
                })
            }
        );
        let json = await response.json();
        if (json.result) {
            window.location = "/home"; // รีโหลดหน้าหลังจากเพิ่มสินค้าสำเร็จ
        }
    };
    

    // const doUpdateProduct = async() => { 
    //     const response = await fetch(
    //     `http://localhost:8080/api/products/${productTypeId}`, // Use correct update endpoint with productId
    //     {
    //       method: "PUT", // Use PUT for updating
    //       headers: {
    //         Accept: "application/json",
    //         'Content-Type': 'application/json',
    //         Authorization: "Bearer " + localStorage.getItem("access_token"),
    //       },
    //       body: JSON.stringify({
    //         product_name: productName,
    //         product_type_id: productTypeId,
    //         price: price,
    //         stock: stock,
    //       }),
    //     }
    //   );
    
    //   let json = await response.json();
    //   if (json.result) {
    //           window.location = "/home";
      
    //   }
    // };

    const doUpdateProduct = async () => { 
        // แก้ url เป็น URL ที่ถูกต้องสำหรับการอัปเดตสินค้า
        const response = await fetch(
            // `URL`,
            `http://localhost:8080/api/products/${productTypeId}`, 
            {
                method: "PUT", // ใช้ PUT สำหรับการอัปเดต
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    price: price,
                    stock: stock,
                }),
            }
        );
        let json = await response.json();
        if (json.result) {
            window.location = "/home"; // รีโหลดหน้าหลังจากอัปเดตสำเร็จ
        }
    };

    return (
        // <>
        //     Product detail ID: {params.productId}
        // </>
        <>
            <div className="container m-auto">
                <Form noValidate validated={validated} onSubmit={onSave}>
            

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validateProductName">
                    <Form.Label>ชื่อสินค้า</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        value={productName}
                        placeholder="ชื่อสินค้า"
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        กรุณากรอก ชื่อสินค้า
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validateProductType">
                    <Form.Label>ประเภทสินค้า</Form.Label>
                    <Form.Select
                        value={productTypeId}
                        onChange={(e) => setProductTypeId(e.target.value)}
                        required>
                        <option label="กรุณาเลือกประเภทสินค้า"></option>
                        {
                            productTypes.map(item => (
                                <option
                                    key={item.product_type_id}
                                    value={item.product_type_id}>{item.product_type_name}
                                </option>
                            ))
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        กรุณาเลือก ประเภทสินค้า
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validatePrice">
                    <Form.Label>ราคาสินค้า</Form.Label>
                    <Form.Control
                        required
                        type="number"
                        value={price}
                        min={0}
                        placeholder="ราคาสินค้า"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        กรุณาเลือก ราคาสินค้า
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validateStock">
                    <Form.Label>จำนวนสินค้า</Form.Label>
                    <Form.Control
                        required
                        type="number"
                        value={stock}
                        min={0}
                        placeholder="จำนวนสินค้า"
                        onChange={(e) => setStock(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        กรุณาเลือก จำนวนสินค้า
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Button variant="primary" type="submit" value="SAVE" >SAVE</Button>
            </Row>
            </Form>
            </div>
        </>
    );
}