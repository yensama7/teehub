import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonContainer } from './button';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const cartItems = useSelector(state => state.cart.items);
    const cartTotalLength = cartItems.reduce((total, item) => total + item.quantity, 0);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const handleSearchToggle = () => {
        setShowSearch(!showSearch);
    };

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        if (searchTerm.trim()) {
            // Navigate to the search results page with the query
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const navbarRef = React.useRef();

    return (
        <div>
            <NavWrapper ref={navbarRef} className='navbar navbar-dark px-sm-5'>
                <ButtonContainer
                    className="menu-toggle d-lg-none"
                    onClick={handleMenuToggle}
                >
                    <i className="fas fa-bars" />
                </ButtonContainer>

                <Link to='/' className='navbar-brand'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 45" width={60} height={60}>
                        <path d="M18,7.05C11.96,7.05,7.05,11.96,7.05,18S11.96,28.95,18,28.95S28.95,24.04,28.95,18S24.04,7.05,18,7.05z M14.63,23.89c-1.39,0-2.53-1.13-2.53-2.53s1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53S16.02,23.89,14.63,23.89z M14.63,17.16c-1.39,0-2.53-1.13-2.53-2.53c0-1.39,1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53C17.16,16.02,16.02,17.16,14.63,17.16z M21.37,23.89c-1.39,0-2.53-1.13-2.53-2.53s1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53S22.76,23.89,21.37,23.89z M21.37,17.16c-1.39,0-2.53-1.13-2.53-2.53c0-1.39,1.13-2.53,2.53-2.53c1.39,0,2.53,1.13,2.53,2.53C23.89,16.02,22.76,17.16,21.37,17.16z"/>
                        <path d="M18,2C9.18,2,2,9.18,2,18c0,8.82,7.18,16,16,16s16-7.18,16-16C34,9.18,26.82,2,18,2z M18,30.63c-6.97,0-12.63-5.67-12.63-12.63S11.03,5.37,18,5.37S30.63,11.03,30.63,18S24.97,30.63,18,30.63z"/>
                    </svg>
                    TeeHub
                </Link>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <ul className='navbar-nav d-flex flex-row navbar-expand-sm justify-content-center'>
                        <li className='nav-item text-title mx-3'>
                            <h3><Link to='/men' className='links'>Men</Link></h3>
                        </li>
                        <li className='nav-item text-title mx-3'>
                            <h3><Link to='/women' className='links'>Women</Link></h3>
                        </li>
                        <li className='nav-item text-title mx-3'>
                            <h3><Link to='/children' className='links'>Children</Link></h3>
                        </li>
                    </ul>
                </div>

                <ul className='navbar-nav d-flex flex-row ml-auto navbar-expand-sm'>
                    <li className='nav-item'>
                        <ButtonContainer className='ml-auto' style={{ border: 'none', borderRadius: '2rem' }} onClick={handleSearchToggle}>
                            <span><i className="fas fa-search" /></span>
                        </ButtonContainer>
                    </li>

                    <li className='nav-item'>
                        <Link to='/Sign_in'>
                            <ButtonContainer className='ml-auto' style={{ border: 'none', borderRadius: '2rem' }}>
                                <span><i className="fas fa-user" /></span>
                            </ButtonContainer>
                        </Link>
                    </li>

                    <li className='nav-item'>
                        <Link to='/cart'>
                            <ButtonContainer className='ml-auto' style={{ border: 'none', borderRadius: '2rem' }}>
                                <span><i className='fas fa-cart-plus' /> {cartTotalLength}</span>
                            </ButtonContainer>
                        </Link>
                    </li>
                </ul>
            </NavWrapper>

            {showSearch && (
                <SearchBarWrapper style={{ top: navbarRef.current ? navbarRef.current.offsetHeight : '70px' }}>
                    <form onSubmit={handleSearchSubmit} className='search-form'>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="form-control"
                            placeholder="Search..."
                        />
                        <ButtonContainer type="submit" className="search-btn">
                            <i className="fas fa-search" />
                        </ButtonContainer>
                    </form>
                </SearchBarWrapper>
            )}
        </div>
    );
};

const NavWrapper = styled.nav`
    background: var(--darkblue);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    width: 100%; 

    .navbar-brand {
        margin-left: 1rem;
        svg {
            fill: black;
        }
    }

    .nav-links {
        display: flex;
        flex: 1;
        justify-content: center;
    }

    .menu-toggle {
        display: none;
        color: black;
        font-size: 2rem;
    }

    .nav-links ul {
        display: flex;
    }

    @media (max-width: 992px) {
        .menu-toggle {
            display: block; 
        }

        .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--darkblue);
            display: none;
            flex-direction: column;
            text-align: center;
        }

        .nav-links.open {
            display: flex;
        }

        .nav-links ul {
            flex-direction: column;
        }
    }

    .nav-link {
        color: var(--maindark) !important;
        font-size: 1.8rem;
        text-transform: capitalize;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    ul.navbar-nav {
        display: flex;
        align-items: center;
    }
`;

const SearchBarWrapper = styled.div`
    position: absolute;
    top: 70px;
    right: 20px;  
    width: 25%;   
    display: flex;
    justify-content: flex-end;  
    
    .search-form {
        display: flex;
        width: 100%;
    }
    .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 2px solid var(--darkblue);
        border-radius: 5px 0 0 5px;
    }
    .search-btn {
        background: var(--darkblue);
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0 5px 5px 0;
    }
`;

export default Navbar;
