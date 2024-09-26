import React, { Component } from 'react'
import axios from 'axios'
import Title from './Title'
import styled from "styled-components";
import { Link } from 'react-router-dom';

export default class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestProducts: []
    };
  }

  componentDidMount() {
    axios.get('core/v1/latest-products') //  API endpoint
      .then(response => {
        console.log(response.data)
        this.setState({ latestProducts: response.data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <React.Fragment>
          <hr className='divider' style={{border: 'none',borderColor:'transparent'}}/>

            <div className='col-md-12 flex-wrap'>
              <div className='col-12'>
                {/* this is the use of the title component*/}
                <Title name="latest" title="products"/>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                {this.state.latestProducts.map((Product) => (
                    <ProductWrapper key={Product.id} className='col-9 mx-auto col-md-6 col-lg-3 my-3'>
                      <Link to={Product.get_absolute_url} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className='card'>
                          <figure className='img-container p-5' onClick={() => console.log("you clicked the image container")}>
                            {/* thumbnail images*/}
                            <img src={Product.get_thumbnail} alt='not working' className='card-img-top'/>
                            {console.log(Product.get_thumbnail)}
                          </figure>

                        {/* card footer */}
                        {/* product.name is the product name and product.price is the price*/}
                        <div className='card-footer d-flex justify-content-between'>
                          <h4 className='align-self-center text-capitalize mb-0'>{Product.name}</h4>
                          <h5 className='text-blue font-italic font-weight-bold mb-0'>
                            <span className='mr-1'>₦</span>
                            {Product.price}
                          </h5>
                        </div>
                        </div>
                      </Link>
                    </ProductWrapper>
                ))}
              </div>
            </div>

      </React.Fragment>
    )
  }
}

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
  border-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.2);
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