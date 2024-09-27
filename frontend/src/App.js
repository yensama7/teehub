import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import Default from './components/Default';
import SignUp from './components/SignIn';
import LogIn from './components/Login';
import Product from './components/Product';
import Category from './components/Category';
import Search from './components/Search';
import MyAccount from './components/MyAccount';

import './App.css';

class App extends Component {
  state = {
    isLoggedIn: false,
  };

  setIsLoggedIn = (value) => {
    this.setState({ isLoggedIn: value });
  };

  render() {
    const { isLoggedIn } = this.state;

    return (
      <React.Fragment>
        <Navbar />
        {isLoggedIn ? (
          <Routes>
            <Route exact path="/" element={<ProductList />} />
            <Route path='/search' element={<Search />} />
            <Route path="/:category_slug/:product_slug" element={<Product />} />
            <Route path="/:category_slug" element={<Category />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/Account" element={<MyAccount />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/" element={<ProductList />} />
            <Route path='/search' element={<Search />} />
            <Route path="/:category_slug/:product_slug" element={<Product />} />
            <Route path="/:category_slug" element={<Category />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/Account" element={<MyAccount />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn setIsLoggedIn={this.setIsLoggedIn} />} />
            <Route path='*' element={<Default />} />
          </Routes>
        )}
      </React.Fragment>
    );
  }
}

export default App;
