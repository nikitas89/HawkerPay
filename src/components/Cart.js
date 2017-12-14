import React, { Component } from 'react';
class Cart extends Component {
  checkout = ()=>{
    this.props.checkout(this.props.cart)

  }
  render() {
    return (
      <div className='cart menu-item-card'>
        <div>
          Cart Items:
        {this.props.cart.length > 0 ? this.props.cart.map((item, index) => {
          return <p key={index}>{item.name}{ <span> {item.quantity} </span> }{<span> {parseFloat(Math.round(item.quantity*item.price * 100) / 100).toFixed(2)} </span>} </p> }) : <p>Empty</p>}
        </div>
        Total : {this.props.total}
        <button type="button" className="mx-2 px-1 rounded float-right" name="checkoutBtn" onClick={this.checkout}>Checkout</button>
      </div>
    );
  }
}
export default Cart;
