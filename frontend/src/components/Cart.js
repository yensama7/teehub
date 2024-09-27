import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';

const Cart = () => {
    // Access cart from Redux store
    const cart = useSelector(state => state.cart);
    const [cartItems, setCartItems] = useState(cart.items);

    useEffect(() => {
        setCartItems(cart.items);
    }, [cart.items]);

    // Remove item from cart
    const removeFromCart = (item) => {
        const updatedItems = cartItems.filter(i => i.product.id !== item.product.id || i.size !== item.size);
        setCartItems(updatedItems);
        // Optionally: dispatch an action to update the store
    };

    // Calculate cart total length and price
    const cartTotalLength = cartItems.reduce((acc, curVal) => acc + curVal.quantity, 0);
    const cartTotalPrice = cartItems.reduce((acc, curVal) => acc + curVal.product.price * curVal.quantity, 0);

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <i><h1 className="my-4 text-cart">Cart</h1></i>
                </div>

                <div className="col-12">
                    {cartTotalLength ? (
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Size</th> {/* New Size Column */}
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <CartItem
                                        key={`${item.product.id}-${item.size}`} // Ensure unique key by combining id and size
                                        initialItem={item}
                                        removeFromCart={removeFromCart}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <i>You don't have any products in your cart...</i>
                    )}
                </div>

                <div className="col-12">
                    <h2 className="my-4">Summary</h2>
                    <strong>${cartTotalPrice.toFixed(2)}</strong>, {cartTotalLength} items
                    <hr />
                    <Link to="/cart/checkout" className="btn btn-dark">Proceed to checkout</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
