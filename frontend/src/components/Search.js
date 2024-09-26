import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductBox from './ProductBox'; // Adjust the path as necessary
import { Spinner } from 'react-bootstrap'; // Bootstrap Spinner for loading state
import { useLocation } from 'react-router-dom'; // For retrieving query parameters

const Search = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Use location to get query params
    const location = useLocation();

    useEffect(() => {
        document.title = 'Search | TeeHub';

        const params = new URLSearchParams(location.search);
        const queryParam = params.get('query');

        if (queryParam) {
            setQuery(queryParam);
            performSearch(queryParam);
        } else {
            setLoading(false); // No query, no need to load products
        }
    }, [location]);

    const performSearch = async (searchQuery) => {
        setLoading(true);

        try {
            const response = await axios.post('/core/v1/products/search/', { query: searchQuery });
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-search">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="title">Search</h1>
                        <h2 className="h5 text-muted">Search term: "{query}"</h2>
                    </div>

                    {loading ? (
                        <div className="col-12 text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        products.map((product) => (
                                <ProductBox product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
