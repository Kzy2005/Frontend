import React from 'react';
// const user = {
//     firstname : 'Abdulkarim',
//     lastname : 'Mamah',
//     imageUrl : 'https://images.unsplash.com/photo-1682685796852-aa311b46f50d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D'
//}
function Profile(prop){
    // const p =prop.data
    const {firstname,lastname,imageUrl} = prop.data
    return(
        <div>
            <h1> Profile </h1>
            {/* <h3> {user.firstname} </h3>
            <h3> {user.lastname} </h3>
            <img src = {user.imageUrl}></img>  */}

            {/* <h3> {prop.data.firstname}{prop.data.lastname} </h3>
            <img src = {prop.data.imageUrl}></img>  */}

            <h3> {firstname}{lastname} </h3>
            <img src = {imageUrl}></img>
        </div>
    )

}

export default Profile