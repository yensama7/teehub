import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify'; // For notifications
import ProductBox from './ProductBox';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get route parameters

const Category = () => {
  const { category_slug } = useParams(); // Extract category_slug from URL
  const [category, setCategory] = useState({ products: [] });

  const getCategory = useCallback(async () => {
    try {
      const response = await axios.get(`/core/v1/products/${category_slug}/`); // Use category_slug
      setCategory(response.data);
      document.title = `${response.data.name} | TeeHub`;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-right',
      });
    }
  }, [category_slug]); // Memoize with the slug as a dependency

  useEffect(() => {
    getCategory();
  }, [getCategory]); // Now the dependency array is properly set

  return (
    <div className='container'>
      <h2 className="text-center text-title text-blue">{category.name}</h2>
      <div className='row'>
        {category.products.map((product) => (
          <ProductBox key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Category;
