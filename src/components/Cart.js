import React, { Component } from 'react';


class Cart extends Component {

  render() {
    return (
      <div className='cart'>
        <div>
          Cart Items:
        {this.props.cart.length > 0 ? this.props.cart.map((item) => {
          return <p>{item.name}{ <span> {item.quantity} </span> }{<span> {item.quantity*item.price} </span>} </p> }) : <p>Empty</p>}
        </div>
      </div>

    );
  }
}

export default Cart;
