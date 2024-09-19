import logo from './logo.svg';
import './App.css';
import Profile from './components/Profile';
import Product from './components/Product';
import { useState, useEffect} from 'react';

function App() {
  const [count,setCount] = useState(0);
  const user = {
        firstname : 'Abdulkarim',
        lastname : 'Mamah',
        imageUrl : 'https://images.unsplash.com/photo-1682685796852-aa311b46f50d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D'
    }
  function incState(){
    setCount(count+1)
  }

  function disState(){
    setCount(count-1)
  }

  return (
    <div className="App">
      <h1> Count is {count} </h1>
      <button onClick={incState}> เพิ่มตัวเลข </button>
      <button onClick={disState}> ลดตัวเลข </button>
      <h1> Prince of Songkla University </h1>
      <Profile data={user}/>
      <Product />
    </div>
  );
}

export default App;
