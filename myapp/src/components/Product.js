import React from 'react';
const products = [
    {id:1,
     title:'broccoli',
     isFruit :false
    },
    {id:2,
        title:'basil',
        isFruit :false
    },
    {id:3,
        title:'apple',
        isFruit :true
    }
];

function Product(){
    return(
     <div>
        {/* <div>
            {products[0].title}
        </div>
        <div>
            {products[1].title}
        </div>
        <div>
            {products[2].title}
        </div> */}


        {products.map( (item) => (
            <div 
            key = {item.id}
            style = {{color:item.isFruit?'red':'green'}}
            >
                {item.title}
            </div>
        ))}
     </div>
    );
}

export default Product