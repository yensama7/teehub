import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Routes,Route} from 'react-router-dom';

import Navbar from './components/Navbar';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import Default from './components/Default';
import Details from './components/Details';
import SignIn from './components/SignIn';
import Login from './components/Login';
import Product from './components/Product';

import './App.css';

class App extends Component{
  render(){
    return (

      <React.Fragment>
        <Navbar></Navbar>
        <Routes>
          <Route exact path="/"  element={<ProductList/>}></Route>
          <Route path="/details"  element={<Details/>}></Route>
          <Route path="/:category_slug/:product_slug" element={<Product/>} />
          <Route path="/cart"  element={<Cart/>}></Route>
          <Route path="/Sign_in"  element={<SignIn/>}></Route>
          <Route path="/login"  element={<Login/>}></Route>
          <Route path='*' element={<Default/>}></Route>
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;