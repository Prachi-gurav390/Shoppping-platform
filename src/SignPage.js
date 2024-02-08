import './SignPage.css';
import {
    Link
  } from "react-router-dom";

export default function SignPage(){
    return <>
        <div className="signContainer">
            <p>
                Login to access the service
            <br/>
            <br/>
                Sign up to create an account
            </p>

            <Link className="signElement" to="/UserSignup">User Signup</Link>
            <Link className="signElement" to="/UserLogin">User Login</Link>
            <Link className="signElement" to="/SellerSignup">Seller Signup</Link>
            <Link className="signElement" to="/SellerLogin">Seller Login</Link>
        </div>
    </>
}