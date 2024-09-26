import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'bulma-toast';
import { useParams } from 'react-router-dom';
import { useDispatch} from 'react-redux';

const Product = () => {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { category_slug, product_slug } = useParams();
    const [selectedSize, setSelectedSize] = useState(null);

    
    const getProduct = useCallback(async () => {
        dispatch({ type: 'setIsLoading', payload: true });

        try {
            const response = await axios.get(`/core/v1/products/${category_slug}/${product_slug}`);
            setProduct(response.data);
            document.title = `${response.data.name} | TeeHub`;
        } catch (error) {
            console.error(error);
        }

        dispatch({ type: 'setIsLoading', payload: false });
    }, [category_slug, product_slug, dispatch]);

    useEffect(() => {
        // Initialize the store
        dispatch({ type: 'INITIALIZE_STORE' });
        getProduct();
    }, [getProduct, dispatch]);

    const addToCart = () => {
        if (!selectedSize) {
            toast({
                message: 'Please select a size',
                type: 'is-danger',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right',
            });
            return;
        }

        if (isNaN(quantity) || quantity < 1) {
            setQuantity(1);
        }

        const item = {
            product: product,
            quantity: quantity,
            size: selectedSize,  // Include the selected size in the item
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
                    <h3 className="display-4 text-title">{product.name}</h3>
                    <hr />
                    <p>{product.description}</p>
                </div>

                <div className="col-md-3">
                    <p><h3><strong className='text-title'>Price: </strong></h3><h4>${product.price}</h4></p>
                    <hr className='divider' style={{border: 'none',borderColor:'transparent'}}/>
                    <div className="input-group mb-3 mt-6">
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-dark add-cart" onClick={addToCart}>Add to cart</button>
                        </div>
                    </div>
                    <h5>Available Sizes:</h5>
                    <div className="sizes">
                        {product.sizes && product.sizes.map(size => (
                            <button 
                                key={size.id} 
                                onClick={() => setSelectedSize(size.name)} 
                                className={`btn ${selectedSize === size.name ? 'brown-outline' : 'black-outline'}`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
