import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Container from './Container';
import SignPage from './SignPage';
import Navbar from './Navbar';
import {UserLogin, UserSignup, SellerLogin, SellerSignup} from './UserLogin.js';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import {ShowCart, UserStore, SellerStore, AddProduct, Kitchen, PersonalCare, Clothing, Electronics, UserClothing, UserElectronics, UserKitchen, UserPersonalCare} from './Store';
import {SellerDashboard} from './SellerDashBoard'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Container>
      <Navbar></Navbar>
      <Router>
        <Routes>
          <Route path='/UserStore' element={<UserStore/>}/>
          <Route path="/UserStore/Kitchen" element={<UserKitchen/>}></Route>
          <Route path="/UserStore/PersonalCare" element={<UserPersonalCare/>}></Route>
          <Route path="/UserStore/Electronics" element={<UserElectronics/>}></Route>
          <Route path="/UserStore/Clothes" element={<UserClothing/>}></Route>
          {/* <Route path="/" element={<SellerStore/>}/>   */}
          <Route path="/SellerStore" element={<SellerStore/>}/>
          <Route path="/Kitchen" element={<Kitchen/>}></Route>
          <Route path="/PersonalCare" element={<PersonalCare/>}></Route>
          <Route path="/Electronics" element={<Electronics/>}></Route>
          <Route path="/Clothes" element={<Clothing/>}></Route>
          <Route path="/SellerStore/NewProduct" element={<AddProduct/>}/>
          <Route path="/" element={<SignPage/>}/>
          <Route path="/UserLogin" element={<UserLogin/>}/>
          <Route path="/UserSignup" element={<UserSignup/>}/>
          <Route path="/SellerLogin" element={<SellerLogin/>}/>
          <Route path="/SellerSignup" element={<SellerSignup/>}/>
          <Route path="/ShowCart" element={<ShowCart/>}/>
          <Route path="/SellerDashboard" element={<SellerDashboard/>}/>
          <Route path="/Error" element={<h1>Something went wrong!</h1>}/>
        </Routes>
      </Router>
    </Container>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();