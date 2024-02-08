import axios from 'axios';  
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

let userToken = "";

const liveUrl = "https://shoppingappserver.onrender.com/";

export function UserLogin(){

    const [user_email, setUserEmail] = useState("");
    const [user_pass, setUserPass] = useState("");
    const [confPass, setConfPass] = useState("");
    const navigate = useNavigate();
    
    function onUserLogin(event){
        event.preventDefault();
        if(confPass!=user_pass){
            window.alert("Password does not match!");
        }else{
            axios.post(liveUrl + "UserLogin", {user_email, user_pass})
            .then(res => {
                if(res.status !== 200){
                    //Display error
                }else{
                    localStorage.clear();
                    localStorage.setItem("Token", res.data);
                    localStorage.setItem("ID", user_email);
                    userToken = res.data;
                    navigate("/UserStore");
                }
            })
            .catch(err => console.log(err))
        }
    }

    return <>
    <div className="signContainer2" onSubmit={onUserLogin}>
            <h4>Login</h4>
            <form  action="/UserLogin" method="post" className="formContainer">
                
                <label htmlFor="email" className="formElement">Enter your email or username :&emsp;</label>
                <input type="email" name="email" id="userEmail"className="formElement" onChange={ (e)=>{setUserEmail(e.target.value)} }/>

                <label htmlFor="password" className="formElement">Enter the password :&emsp;</label>
                <input type="password" name="password" id="userPassword" className="formElement" onChange={ (e)=>{setUserPass(e.target.value)} }/>

                <label className="formElement">Confirm your password :&emsp;</label>
                <input className="formElement" type="password" onChange={(e)=>{setConfPass(e.target.value)}}/>

                <button type="submit" className="formElement">Submit</button>

            </form>
            <p></p>
    </div>
    </>
}

export function UserSignup(){

    const [username, setUserName] = useState("");
    const [user_email, setUserEmail] = useState("");
    const [user_pass, setUserPass] = useState("");
    const [confPass, setConfPass] = useState("");

    const navigate = useNavigate();
    
    function onUserSignup(event){
        event.preventDefault();
        if(confPass!=user_pass){
            window.alert("Password does not match!");
        }else{
            axios.post(liveUrl + "UserSignup", {user_pass, username, user_email})
            .then(res => {console.log(res)
            navigate("/UserLogin");
            })
            .catch(err => console.log(err))
        }
    }

    return <>
    <div className="signContainer2">
            <h4>Signup</h4>
            <form onSubmit={onUserSignup} action="/UserSignup" method="post" className="formContainer">
                
                <label htmlFor="username" className="formElement">Choose a Username :&emsp;</label>
                <input type="text" name="username" id="userLoginName" className="formElement" onChange={ (e)=>{setUserName(e.target.value)} }/>
                
                <label htmlFor="email" className="formElement">Enter your email :&emsp;</label>
                <input type="email" name="email" id="userEmail"className="formElement" onChange={ (e)=>{setUserEmail(e.target.value)} }/>

                <label htmlFor="password" className="formElement">Choose a password :&emsp;</label>
                <input type="password" name="password" id="userPassword" className="formElement" onChange={ (e)=>{setUserPass(e.target.value)} }/>

                <label className="formElement">Confirm your password :&emsp;</label>
                <input className="formElement" type="password" onChange={(e)=>{setConfPass(e.target.value)}}/>

                <button type="submit" className="formElement">Submit</button>
            </form>
            <p></p>
    </div>
    </>
}

export function SellerLogin(){
    const [seller_email, setSellerEmail] = useState("");
    const [seller_pass, setSellerPass] = useState("");
    const [confPass, setConfPass] = useState("");
    const navigate = useNavigate();
    function onSellerLogin(event){
        localStorage.clear();
        event.preventDefault();
        if(confPass!=seller_pass){
            window.alert("Password does not match!");
        }else{
            axios.post(liveUrl + "SellerLogin", {seller_email, seller_pass})
            .then(res => {
                if(res.status !== 200){
                    //Display error
                }else{
                    localStorage.setItem("Token", res.data);
                    localStorage.setItem("ID", seller_email);
                    userToken = res.data;
                    navigate("/SellerStore");
                }
            })
            .catch(err => {console.log(err)})
        }
        
    }

    return <>
    <div className="signContainer2">
            <h4>Seller Login</h4>
            <form  onSubmit={onSellerLogin} className="formContainer">

                <label htmlFor="email" className="formElement">Enter your Seller email or username :&emsp;</label>
                <input type="email" name="email" id="userEmail"className="formElement" onChange={ (e)=>{setSellerEmail(e.target.value)} }/>

                <label htmlFor="password" className="formElement">Enter the password :&emsp;</label>
                <input type="password" name="password" id="userPassword" className="formElement" onChange={ (e)=>{setSellerPass(e.target.value)} }/>

                <label className="formElement">Confirm your password :&emsp;</label>
                <input className="formElement" type="password" onChange={(e)=>{setConfPass(e.target.value)}}/>
                
                <button type="submit" className="formElement">Submit</button>
            </form>
            <p></p>
    </div>
    </>
}

export function SellerSignup(){
    
    const [seller_name, setSellerName] = useState("");
    const [seller_email, setSellerEmail] = useState("");
    const [seller_pass, setSellerPass] = useState("");
    const [confPass, setConfPass] = useState("");

    const navigate = useNavigate();
    
    function onSellerSignup(event){
        event.preventDefault();
        if(confPass!=seller_pass){
            window.alert("Password does not match!")
        }else{
            axios.post(liveUrl + "SellerSignup", {seller_pass, seller_name, seller_email})
            .then(res => {console.log(res)
            navigate("/SellerLogin");
            })
            .catch(err => console.log(err))
        }
    }
    
    return <>
    <div className="signContainer2">
            <h4>Seller Signup</h4>
            <form  onSubmit={onSellerSignup} className="formContainer">
                
                <label htmlFor="username" className="formElement">Choose a Username :&emsp;</label>
                <input type="text" name="username" id="userLoginName" className="formElement"
                onChange={ (e)=>{setSellerName(e.target.value)} }/>
                
                <label htmlFor="email" className="formElement">Enter your email :&emsp;</label>
                <input type="email" name="email" id="userEmail"className="formElement" 
                onChange={ (e)=>{setSellerEmail(e.target.value)}}/>

                <label htmlFor="password" className="formElement">Choose a password :&emsp;</label>
                <input type="password" name="password" id="userPassword" className="formElement" 
                onChange={(e)=>{setSellerPass(e.target.value)}}/>

                <label className="formElement">Confirm your password :&emsp;</label>
                <input className="formElement" type="password" onChange={(e)=>{setConfPass(e.target.value)}}/>

                <button type="submit" className="formElement">Submit</button>
                    
            </form>
            <p></p>
    </div>
    </>
}