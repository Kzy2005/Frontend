import { Link } from "react-router-dom";
import './Page.css';

export default function Page(props) {
    // const { data, addToCart } = props;

    return (<>
    <><div className="header">
            <div className="welcome-container">
                <h1 className="welcome-heading">Welcome to the anime lamp shop</h1>
                <div className="title">ท่านลูกค้าสามารถเลือกชมและรับซื้อโคมไฟน่ารักๆเป็นตัวอนิเมะได้โดยจิ้มปุ่มข้างล่างได้เลยน่าาา!!!</div>
               <div><Link to={`/home`} className="btn btn-primary">สินค้าของทางร้าน</Link></div>
            </div>
            
        </div>
        </>
    
    
    </>
    );
}