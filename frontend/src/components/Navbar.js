import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonContainer } from './button';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Navbar = () => {
    // Access the cart items from Redux store
    const cartItems = useSelector(state => state.cart.items);
    
    // Calculate total length of cart items
    const cartTotalLength = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log(cartTotalLength)

    return (
        <div>
            {/* This is the nav bar */}
            <NavWrapper className='navbar navbar-dark px-sm-5'>
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <Link to='/' className='nav-link'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 45" className='navbar-brand' width={60} height={60}>
                                <path d="M18,7.05C11.96,7.05,7.05,11.96,7.05,18S11.96,28.95,18,28.95S28.95,24.04,28.95,18S24.04,7.05,18,7.05z M14.63,23.89c-1.39,0-2.53-1.13-2.53-2.53s1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53S16.02,23.89,14.63,23.89z M14.63,17.16c-1.39,0-2.53-1.13-2.53-2.53c0-1.39,1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53C17.16,16.02,16.02,17.16,14.63,17.16z M21.37,23.89c-1.39,0-2.53-1.13-2.53-2.53s1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53S22.76,23.89,21.37,23.89z M21.37,17.16c-1.39,0-2.53-1.13-2.53-2.53c0-1.39,1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53C23.89,16.02,22.76,17.16,21.37,17.16z"/>
                                <path d="M18,2C9.18,2,2,9.18,2,18c0,8.82,7.18,16,16,16s16-7.18,16-16C34,9.18,26.82,2,18,2z M18,30.63c-6.97,0-12.63-5.67-12.63-12.63S11.03,5.37,18,5.37S30.63,11.03,30.63,18S24.97,30.63,18,30.63z"/>
                            </svg>
                            TeeHub
                        </Link>
                    </li>
                </ul>

                <ul className='navbar-nav d-flex flex-row ml-auto navbar-expand-sm'>

                    <li className='nav-item'>
                        <Link to='/Sign_in'>
                            <ButtonContainer className='ml-auto' style={{ border: 'none', borderRadius: '2rem' }}>
                                <span>
                                    {/* This is the search icon */}
                                    <i className="fas fa-search" />
                                </span>
                            </ButtonContainer>
                        </Link>
                    </li>

                    <li className='nav-item'>
                        <Link to='/Sign_in'>
                            <ButtonContainer className='ml-auto' style={{ border: 'none', borderRadius: '2rem' }}>
                                <span>
                                    {/* This is the user icon */}
                                    <i className="fas fa-user" />
                                </span>
                            </ButtonContainer>
                        </Link>
                    </li>

                    <li className='nav-item'>
                        <Link to='/cart'>
                            <ButtonContainer className='ml-auto' style={{ border: 'none', borderRadius: '2rem' }}>
                                <span>
                                    {/* This is the cart icon */}
                                    <i className='fas fa-cart-plus' /> {cartTotalLength}
                                </span>
                            </ButtonContainer>
                        </Link>
                    </li>
                </ul>
            </NavWrapper>
        </div>
    );
};

const NavWrapper = styled.nav`
    background: var(--darkblue);
    .nav-link {
        color: var(--maindark) !important;
        font-size: 1.8rem;
        text-transform: capitalize;
    }
`;

export default Navbar;
