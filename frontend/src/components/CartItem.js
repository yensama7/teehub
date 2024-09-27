import React from 'react';
import { useDispatch } from 'react-redux'; // To dispatch actions
import { Link } from 'react-router-dom';

const CartItem = ({ initialItem }) => {
  const dispatch = useDispatch(); // Hook to dispatch actions
  const { product, quantity, size } = initialItem; // Include size in destructuring

  // Get the total price for the current item
  const getItemTotal = () => {
    const price = parseFloat(product.price) || 0; // Ensure price is a number, fallback to 0 if undefined
    return quantity * price;
  };

  // Handle decrementing quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      dispatch({
        type: 'addToCart',
        payload: { product, quantity: -1, size }, // Decrement by 1 while keeping the size
      });
    } else {
      removeItem(); // If quantity is 1, removing the item
    }
  };

  // Handle incrementing quantity
  const incrementQuantity = () => {
    dispatch({
      type: 'addToCart',
      payload: { product, quantity: 1, size }, // Increment by 1 while keeping the size
    });
  };

  // Remove the item from the cart
  const removeItem = () => {
    dispatch({
      type: 'removeFromCart', // Create a new action to handle item removal
      payload: { productId: product.id, size }, // Include size in the payload for removal
    });
  };

  const price = parseFloat(product.price) || 0; // Ensure price is a number

  return (
    <tr>
      <td>
        <Link to={product.get_absolute_url} className='links'>{product.name}</Link>
      </td>
      <td>{size}</td> {/* Display the selected size */}
      <td>${price.toFixed(2)}</td> {/* Use price.toFixed only after ensuring it's a number */}
      <td>
        <a href="#!" onClick={decrementQuantity} className="mx-2 links">-</a>
        {quantity}
        <a href="#!" onClick={incrementQuantity} className="mx-2 links">+</a>
      </td>
      <td>${getItemTotal().toFixed(2)}</td> {/* Ensure the total is calculated correctly */}
      <td>
        <button className="btn btn-danger" onClick={removeItem}>
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
