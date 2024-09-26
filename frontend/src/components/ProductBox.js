import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // For routing in React
import styled from 'styled-components';

const ProductBox = ({ product }) => {
  return (
    <ProductWrapper key={product.id} className='col-9 mx-auto col-md-6 col-lg-3 my-3'>
      <Link to={product.get_absolute_url} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className='card'>
          <figure className='img-container p-5' onClick={() => console.log("you clicked the image container")}>
            {/* thumbnail images*/}
            <img src={product.get_thumbnail} alt='not working' className='card-img-top'/>
          </figure>

          {/* card footer */}
          {/* product.name is the product name and product.price is the price*/}
          <div className='card-footer d-flex justify-content-between'>
            <h4 className='align-self-center text-capitalize mb-0'>{product.name}</h4>
            <h5 className='text-blue font-italic font-weight-bold mb-0'>
              <span className='mr-1'>₦</span>
              {product.price}
            </h5>
          </div>
        </div>
      </Link>
    </ProductWrapper>
  )
};

ProductBox.propTypes = {
  product: PropTypes.object.isRequired,
};

const ProductWrapper = styled.div`
  .card{
    background-color: var(--maninbrown);
    border: 0.05rem solid;
    border-radius: 0.5rem;
    border-color: transparent;
    transition: all 1s linear;
    box-sizing: border-box;
  }

  .card-footer{
    background: transparent;
    border-top: transparent;
    transition: all 1s linear;
  }

  &:hover{
    .card{
      border: 0.04rem solid rgba(0, 0, 0, 0.2);
      box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.2);
    }

    .card-footer{
      background: var(--darkbrown);
    }
  }

  .img-container{
    position: relative;
    overflow: hidden;
  }

  .card-img-top{
    transition: all 1s linear;
  }

  .img-container:hover .card-img-top{
    transform: scale(1.1);
  }
`;

export default ProductBox;
