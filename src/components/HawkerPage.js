import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
import '../App.css';
class HawkerPage extends Component {
  state = {
  items:  [{id: 1, name: "BASIL LEAF RICE", price: 4.50},
            {id: 2, name: "Epic Apple", price: 3.29},
            {id: 3, name: "Awesome Grape", price: 7.49}],
  cart: []
  }

  addToCart =  (item) =>{
    console.log("FOUND CART!")
    var found = false;
    var updatedCart = this.state.cart.map((cartItem) => {
      if (cartItem.name == item.name) {
        found = true;
        cartItem.quantity++;
        return cartItem;
      } else {
        return cartItem;
      }
    });

    if (!found) { updatedCart.push({id: item.id, name: item.name, price: item.price, quantity: 1, key:item.id}) }

    this.setState({
      cart: updatedCart
    });
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <h1>Sisaket Thai</h1>
          <img className="hero-image" src="https://www.whyq.sg/images?src=https://s3-ap-southeast-1.amazonaws.com/whyqsg/uploads/stalls/b5e0b7c0ca47415723b28f2d94f9877e.PNG&h=356&w=640&zc=" alt=""/>
          <h3>Menu:</h3>
        </header>
        <div >
          {/* {if this.state.cart.length>0 {
            return
          }} */}
          <Cart cart={this.state.cart} />
        </div>

        <div className="menu-items-list">
          {this.state.items.map((item, index) => {
            return <MenuItem key={index} item={item} addToCart={this.addToCart} />
          })}
        </div>
      </div>
    );
  }
}

export default HawkerPage;
