import { useState, useEffect, useRef } from 'react';
import './Store.css';
import {useAuth} from './jwtauth';
import {Link} from 'react-router-dom';
// const axios = require('axios')
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SellerDashboardBtn } from './SellerDashBoard';

const liveUrl = "https://shoppingappserver.onrender.com/";

export function UserStore() {
  const authenticated = useAuth("auth");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cartIdLoaded, setCartIdLoaded] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const userID = localStorage.getItem("ID");
      fetch(`${liveUrl}GetCartId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID: userID }),
      })
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("cart_id", res.cart_id);
          setCartIdLoaded(true);
        })
        .catch((err) => console.log(err));
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [authenticated]);

  if (!cartIdLoaded) {
    return <div>Loading...</div>;
  }

  if (isAuthorized) {
    return (
      <>
        <SearchBar />
        <ProductGrid />
      </>
    );
  } else {
    return (
      <>
        <div>Unauthorized</div>
      </>
    );
  }
}

function SearchBar(){
    return <>
        <input className="searchBar" type='text'/>
    </>
}

function ProductGrid(){
    return <>
        <div className='productGridContainer'>
            <div className="item1"><Link className='noStyle' to="/Kitchen">Kitchen</Link></div>
            <div className="item2"><Link className='noStyle' to="/Electronics">Electronics</Link></div>
            <div className="item3"><Link className='noStyle' to="/Clothes">Clothes</Link></div>
            <div className="item4"><Link className='noStyle' to="/PersonalCare">PersonalCare</Link></div>
        </div>
    </>
}

function AddProductBtn(){
    return <>
    <div className='addProduct' >
        <Link to="/SellerStore/NewProduct" className='noStyle'>Add Product</Link>
    </div>
    </>
}

export function SellerStore(){

  const authenticated = useAuth("authSeller");
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(()=>{
    if (authenticated) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [authenticated]);
  
  if (isAuthorized) {
    return <>
      <SearchBar/>
      <ProductGrid/>
      <SellerDashboardBtn/>
    </>
  } else {
    return <>
      <div>
        Unauthorized
      </div>
    </>
  }
}

export function AddProduct(){
    const navigate = useNavigate();
    const [pname, setPname] = useState("");
    const [pprice, setPprice] = useState(0);
    const [pdescr, setPdescr] = useState("");
    const [category, setCategory] = useState("kitchen");

    function newProduct(event){
        event.preventDefault();
        console.log(category);
        const seller_ID = localStorage.getItem("ID");
        axios.post(`${liveUrl}SellerStore/NewProduct`, {seller_ID, pname, pprice, pdescr, category})
        .then((res) => {
            if(res.status === 200)
                {window.alert("Successfully saved your data")
                window.location.reload()}
                else{
                    navigate("/Error");
                }
            } )
        .catch((err) => {console.log(err); navigate("/Error")})
    }

    return <>
        <form  onSubmit={newProduct} className="formContainer">
            <label htmlFor="product_name" className="formElement">Enter product name :&emsp;</label>
            <input type="text" name="product_name" className="formElement" onChange={ (e)=>{setPname(e.target.value)} }/>

            <label htmlFor="product_price" className="formElement">Enter the price :&emsp;</label>
            <input type="text" name="product_price" className="formElement" onChange={ (e)=>{setPprice(e.target.value)} }/>

            <label htmlFor="product_descr" className="formElement">Enter product description :&emsp;</label>
            <input type='textarea' className="formElement" onChange={ (e)=>{setPdescr(e.target.value)} }/>

            <label htmlFor='category' className='formElement'>Enter category</label>
            <select className='formElement' onChange={(e) => { setCategory(e.target.value)}}>
                <option value = "kitchen">Kitchen</option>
                <option value = "personalCare">Personal care</option>
                <option value = "electronics">Electronics</option>
                <option value = "clothing">Clothes</option>
            </select>


                
            <button type="submit" className="formElement">Submit</button>
        </form>
    </>
}

export function Kitchen(){
    const [KitchenProd, setKitchenProds] = useState([]);
    const authenticated = useAuth("authSeller");
    
    useEffect(() => {
      const seller_ID = localStorage.getItem("ID");
      if (authenticated) {
        fetch(`${liveUrl}Kitchen`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"seller_ID": seller_ID})
        })
        .then((res) => res.json())
        .then((res) => setKitchenProds(res))
        .catch(err => console.log(err));
      }
    }, [authenticated]);
  
    return (<>
        <div className='itemContainer'>
          {KitchenProd.map(prod => (
              <div className='mappedElement'  key={prod.p_id}>
              <h2>{prod.p_name}</h2>
              <p>{prod.p_descr}</p>
              <p>Price: {prod.p_price}</p>
              <AddProductBtn/>
            </div>
            
            ))}
        </div>
        </>
      );
  }
  
  export function Electronics(){
    const [ElectronicProd, setElectronicProd] = useState([]);
    const authenticated = useAuth("authSeller");
    
    useEffect(() => {
      const seller_ID = localStorage.getItem("ID");
      if (authenticated) {
        fetch(`${liveUrl}Electronics`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"seller_ID": seller_ID})
        })
        .then((res) => res.json())
        .then((res) => setElectronicProd(res))
        .catch(err => console.log(err));

      }
    }, [authenticated]);

    return (<>
      <div className='itemContainer'>
        {ElectronicProd.map(prod => (
            <div className='mappedElement' key={prod.p_id}>
            <h2>{prod.p_name}</h2>
            <p >{prod.p_descr}</p>
            <p>Price: {prod.p_price}</p>
          </div>
          
          ))}
      </div>
      <AddProductBtn/>
      </>
    );
  }
  export function Clothing(){
    const [ClothingProd, setClothingProd] = useState([]);
    const authenticated = useAuth("authSeller");
    
    useEffect(() => {
      const seller_ID = localStorage.getItem("ID");
      if (authenticated) {
        fetch(`${liveUrl}Clothes`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"seller_ID": seller_ID})
        })
        .then((res) => res.json())
        .then((res) => setClothingProd(res))
        .catch(err => console.log(err));
      }
    }, [authenticated]);
  
    return (<>
        <div className='itemContainer'>
          {ClothingProd.map(prod => (
              <div className='mappedElement'  key={prod.p_id}>
              <h2>{prod.p_name}</h2>
              <p>{prod.p_descr}</p>
              <p>Price: {prod.p_price}</p>
            </div>
            
            ))}
        </div>
        <AddProductBtn/>
        </>
      );
  }

  export function PersonalCare(){
    const [PCProd, setPCProd] = useState([]);
    const authenticated = useAuth("authSeller");
    
    useEffect(() => {
      const seller_ID = localStorage.getItem("ID");
      if (authenticated) {
        fetch(`${liveUrl}PersonalCare`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"seller_ID": seller_ID})
        })
        .then((res) => res.json())
        .then((res) => setPCProd(res))
        .catch(err => console.log(err));
      }
    }, [authenticated]);
  
    return (<>
        <div className='itemContainer'>
          {PCProd.map(prod => (
              <div className='mappedElement' key={prod.p_id}>
              <h2>{prod.p_name}</h2>
              <p>{prod.p_descr}</p>
              <p>Price: {prod.p_price}</p>
            </div>
            
            ))}
        </div>
        <AddProductBtn/>
        </>
      );
  }

  function AddToCartBtn(props){

    return <>
        <button onClick={() => AddToCart(props.pid)}>Add to cart</button>
    </>
  }
  
  function RemoveFromCartBtn(props){
    const handleRemove = () => {
      props.onRemove(props.cart_id, props.pid)
    }
    return <>
        <button onClick={() => handleRemove(props.cart_id, props.pid)}>-</button>
    </>
  }
  function AddToCartBtn2(props){
    const handleAdd = () => {
      props.onAdd(props.pid)
    }
    return <>
        <button onClick={() => handleAdd(props.pid)}>+</button>
    </>
  }
  function DeleteFromCartBtn(props){
    const handleDelete = () => {
      props.onDelete(props.cart_id, props.pid)
    }
    return <>
        <button onClick={() => handleDelete(props.cart_id, props.pid)}>Delete</button>
    </>
  }
  
  function AddToCart(data){
    console.log("add to cart");
    const userID = localStorage.getItem("ID");
    fetch(`${liveUrl}AddToCart`, {method: "POST",headers: {"Content-Type": "application/json"} ,body: JSON.stringify({ID: userID, pid: data})})
    .catch(res => console.log(res))

    window.alert("Product added to cart");
  }

  function CartBtn(){
    return <>
        <Link className='addProduct' to={"/ShowCart"}>Cart</Link>
    </>
  }

  export function ShowCart(){
    const navigate = useNavigate();
    const [item, setItem] = useState([]);
    const [key, setKey] = useState(0);
    
    useEffect(()=>{
      const userID = localStorage.getItem("ID");
      
      fetch(`${liveUrl}ShowCart`, {method: "POST", headers: {"Content-Type": "application/json"}, body:JSON.stringify({ID: userID})})
      .then(res => res.json())
      .then(res => setItem(res))
      .catch(res => console.log(res))
    }, [key])
    
    function DeleteFromCart(cartID, p_id){
      const userID = localStorage.getItem("ID");
      fetch(`${liveUrl}DeleteFromCart`, {method: "POST",headers: {"Content-Type": "application/json"} ,body: JSON.stringify({ID: userID, cart_id: cartID, pid: p_id})})
      .catch(res => console.log(res))

      navigate("/ShowCart");
      setKey((key) => key + 1);
    }

    function AddToCart2(data){

      console.log("add to cart");
      const userID = localStorage.getItem("ID");
      fetch(`${liveUrl}AddToCart`, {method: "POST",headers: {"Content-Type": "application/json"} ,body: JSON.stringify({ID: userID, pid: data})})
      .catch(res => console.log(res))

      navigate("/ShowCart");
      setKey(!key);
    }
    
    function RemoveFromCart(cartID, p_id){
      console.log("remove from cart");
      const userID = localStorage.getItem("ID");
      fetch(`${liveUrl}RemoveFromCart`, {method: "POST",headers: {"Content-Type": "application/json"} ,body: JSON.stringify({ID: userID, cart_id: cartID, pid: p_id})})
      .catch(res => console.log(res));
      
      navigate("/ShowCart");
      setKey(!key);
    }
    

    return <>
      <div className='itemContainer'>
        {
          item.map((i, index) => (
            <div className='mappedElement' key={index} >
              <h2>{i.p_name}</h2>
              <p>{i.p_descr}</p>
              <p>Price: {i.p_price}</p>
              <p>Quantity: {i.quantity}</p>
              <AddToCartBtn2 pid = {i.p_id} onAdd={AddToCart2} />
              <RemoveFromCartBtn pid = {i.p_id} cart_id = {i.cart_id} onRemove={RemoveFromCart}/>
              {/* <DeleteFromCartBtn pid = {i.p_id} cart_id = {i.cart_id} /> */}
              <DeleteFromCartBtn pid = {i.p_id} cart_id = {i.cart_id} onDelete={DeleteFromCart}/>
            </div>
          ))
        }
        <PlaceOrderBtn/>
      </div>
    </>
  }

  export function UserClothing(){
    const [Prod, setProd] = useState([]);
    const authenticated = useAuth("auth");
    if(authenticated){
      const userID = localStorage.getItem("ID");

      fetch(`${liveUrl}UserStore/Clothing`)
      .then(res => res.json())
      .then(res => setProd(res))
      .catch(res => console.log(res));

    }else{
      return <>
        <div>
            Unauthorized
        </div>
      </>
    }

    return (<>
      <div className='itemContainer'>
        {Prod.map((prod, index) => (
            <div className='mappedElement' key={index} data-pid={prod.p_id}>
            <h2>{prod.p_name}</h2>
            <p>{prod.p_descr}</p>
            <p>Price: {prod.p_price}</p>
            <AddToCartBtn pid={prod.p_id}/>

          </div>
          ))}
          <CartBtn/>
      </div>
      </>
    );
  }
  export function UserElectronics(){
    const [Prod, setProd] = useState([]);
    const authenticated = useAuth("auth");
    if(authenticated){
      const userID = localStorage.getItem("ID");

      fetch(`${liveUrl}UserStore/Electronics`)
      .then(res => res.json())
      .then(res => setProd(res))
      .catch(res => console.log(res));

    }else{
      return <>
        <div>
            Unauthorized
        </div>
      </>
    }

    return (<>
      <div className='itemContainer'>
        {Prod.map((prod, index) => (
            <div className='mappedElement' key={index} data-pid={prod.p_id}>
            <h2>{prod.p_name}</h2>
            <p>{prod.p_descr}</p>
            <p>Price: {prod.p_price}</p>
            <AddToCartBtn pid={prod.p_id}/>
          </div>
          ))}
          <CartBtn/>
      </div>
      </>
    );
  }
  export function UserKitchen(){
    const [Prod, setProd] = useState([]);
    const authenticated = useAuth("auth");
    if(authenticated){
      const userID = localStorage.getItem("ID");

      fetch(`${liveUrl}UserStore/Kitchen`)
      .then(res => res.json())
      .then(res => setProd(res))
      .catch(res => console.log(res));

    }else{
      return <>
        <div>
            Unauthorized
        </div>
      </>
    }

    return (<>
      <div className='itemContainer'>
        {Prod.map((prod, index) => (
            <div className='mappedElement' key={index} data-pid={prod.p_id}>
            <h2>{prod.p_name}</h2>
            <p>{prod.p_descr}</p>
            <p>Price: {prod.p_price}</p>
            <AddToCartBtn pid={prod.p_id}/>
          </div>
          ))}
          <CartBtn/>
      </div>
      </>
    );
  }
  export function UserPersonalCare(){
    const [Prod, setProd] = useState([]);
    const authenticated = useAuth("auth");
    if(authenticated){
      const userID = localStorage.getItem("ID");

      fetch(`${liveUrl}UserStore/PersonalCare`)
      .then(res => res.json())
      .then(res => setProd(res))
      .catch(res => console.log(res));

    }else{
      return <>
        <div>
            Unauthorized
        </div>
      </>
    }

    return (<>
      <div className='itemContainer'>
        {Prod.map((prod, index) => (
            <div className='mappedElement' key={index} data-pid={prod.p_id}>
            <h2>{prod.p_name}</h2>
            <p>{prod.p_descr}</p>
            <p>Price: {prod.p_price}</p>
            <AddToCartBtn pid={prod.p_id}/>
          </div>
          ))}
          <CartBtn/>
      </div>
      </>
    );
  }

  function PlaceOrderBtn(){
    return <>
      <div >
        <button className='addProduct' onClick={PlaceOrder}>Place Order</button>
      </div>
    </>
  }

function PlaceOrder(){
    const userID = localStorage.getItem("ID");
    const cart_id = localStorage.getItem("cart_id");
    fetch(`${liveUrl}PlaceOrder`, {method: "POST",headers: {"Content-Type": "application/json"} ,body: JSON.stringify({ID: userID, cart_id: cart_id})})
    .then(window.alert("Order Placed Successfully")).then(window.location.reload()).catch((err) => console.log(err))
  }