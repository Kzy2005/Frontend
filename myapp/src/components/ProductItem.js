//แสดงข้อมูลของสินค้า
// import { Link } from "react-router-dom";

// export default function ProductItem(props) {
//     return (
//         <div className="card row border rounded shadow-sm mt-3">
//             <div className="col-3">
//                 <img src= {`http://localhost:8080/images/${props.data.image_url}`} width={100} alt={props.data.product_name} />
//             </div>
//             <div className="col-7">
//                 <h5 className="text-primary">{props.data.product_name}</h5>
//                 <Link to={`/product/${props.data.product_id}`} className="btn btn-outline-primary me-3">แก้ไข</Link>
//                 <button type="button" className="btn btn-outline-danger">ลบ</button>
//             </div>
//             <div className="col-2">
//                 <span className="text-danger fs-4">{props.data.price}</span>
//             </div>
//         </div>
//     );
// }

import { Link } from "react-router-dom";
import { Card, Col, Button,} from "react-bootstrap";
import './ProductItem.css';

export default function ProductItem(props) {
    const { data, addToCart } = props;

    return (
        <div className="All">
        <Col xs={12}>
          <Card className="border rounded shadow-sm mt-3">
            <Card.Img variant="top" src={`http://localhost:8080/images/${data.image_url}`} alt={data.product_name} />
            <Card.Body>
              <Card.Title className="text-primary">{data.product_name}</Card.Title>
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="outline-primary" onClick={() => addToCart(data)}>เลือก</Button>
                <div>ราคา</div>
                {/* <Button variant="outline-danger">ลบ</Button> */}
                <span className="text-danger fs-4">{data.price}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </div>
  
    );
}