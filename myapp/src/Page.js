import { Link } from "react-router-dom";
import './Page.css';

export default function Page(props) {
    // const { data, addToCart } = props;

    return (<>
    <><div className="header">
            <div className="welcome-container">
                <h1 className="welcome-heading">Welcome to the pet food</h1>
                <div className="title">ท่านลูกค้าสามารถเลือกชมข้อมูลและอาหารประเภทที่ต้องการได้โดยจิ้มปุ่มข้างล่างได้เลยน่าาา!!!</div>
               <div><Link to={`/home`} className="btn btn-primary">Pet Food</Link></div>
            </div>
            
        </div>
        </>
    
    
    </>
    );
}