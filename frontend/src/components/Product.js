import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'bulma-toast';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Product = () => {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { category_slug, product_slug } = useParams();

    const getProduct = useCallback(async () => {
        dispatch({ type: 'setIsLoading', payload: true });

        try {
            const response = await axios.get(`/core/v1/products/${category_slug}/${product_slug}`);
            setProduct(response.data);
            document.title = `${response.data.name} | Djackets`;
        } catch (error) {
            console.error(error);
        }

        dispatch({ type: 'setIsLoading', payload: false });
    }, [category_slug, product_slug, dispatch]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    const addToCart = () => {
        if (isNaN(quantity) || quantity < 1) {
            setQuantity(1);
        }

        const item = {
            product: product,
            quantity: quantity,
        };

        dispatch({ type: 'addToCart', payload: item });

        toast({
            message: 'The product was added to the cart',
            type: 'is-success',
            dismissible: true,
            pauseOnHover: true,
            duration: 2000,
            position: 'bottom-right',
        });
    };

    return (
        <div className="page-product">
            <div className="row">
                <div className="col-md-9">
                    <figure className="mb-6">
                        <img src={product.get_image} alt={product.name} className="img-fluid" />
                    </figure>
                    <h1 className="display-4">{product.name}</h1>
                    <p>{product.description}</p>
                </div>

                <div className="col-md-3">
                    <h2 className="h5">Information</h2>
                    <p><strong>Price: </strong>${product.price}</p>
                    <div className="input-group mb-3 mt-6">
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-dark" onClick={addToCart}>Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
