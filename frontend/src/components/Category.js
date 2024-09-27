import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import ProductBox from './ProductBox';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap

const Category = () => {
  const { category_slug } = useParams(); 
  const [category, setCategory] = useState({ products: [] });
  const [loading, setLoading] = useState(true); // Add loading state

  const getCategory = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`/core/v1/products/${category_slug}/`);
      setCategory(response.data);
      document.title = `${response.data.name} | TeeHub`;
      setLoading(false); // Stop loading when data is loaded
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-right',
      });
      setLoading(false); // Stop loading on error
    }
  }, [category_slug]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  return (
    <div className='container'>
      {loading ? (
        // Display the spinner while loading
        <div className="text-center">
          <Spinner animation="border" role="status" style={{color: 'black'}}>
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        // Display content when not loading
        <>
          <h2 className="text-center text-title text-blue">{category.name}</h2>
          <div className='row'>
            {category.products.map((product) => (
              <ProductBox key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
