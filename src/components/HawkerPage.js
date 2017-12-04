import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
import '../App.css';
import firebase from '../firebase.js'
import Order from './Order.js'

const dbRefObj = firebase.database().ref().child('restaurants')
// dbRefObj.on('value', snap=>
//   console.log(snap.val())
// )

class HawkerPage extends Component {
  state = {
    //load items from db
  items:  [{id: 1, name: "BASIL LEAF RICE", price: 4.50},
            {id: 2, name: "Epic Apple", price: 3.29},
            {id: 3, name: "Awesome Grape", price: 7.49}],
  cart: [],
  total:''
  }

  setItemsState = ()=>{
    var itemsChange = this.state.items
   dbRefObj.on('value', snap=>{
     itemsChange = snap.val()["-L-W3ZtnZCvHzeYiqoRA"].items
     console.log("snap val in method 1", snap.val()["-L-W3ZtnZCvHzeYiqoRA"].items)
      this.setState({
        items: itemsChange
      })
      console.log(this.state.items);
    })
 }

  addToCart =  (item) =>{
    console.log(item);
    var found = false;
    //write to db as well.
    //then read state from db.
    //ensure real time updates..
    var updatedCart = this.state.cart.map((cartItem) => {
      if (cartItem.name === item.name) {
        found = true;
        cartItem.quantity++;
        return cartItem;
      } else {
        return cartItem;
      }
    })

    if (!found) { updatedCart.push({id: item.id, name: item.name, price: item.price, quantity: 1, key:item.id}) }

    let totalNum = 0
    updatedCart.forEach((item)=>{
        totalNum += item.quantity*item.price
      })
      totalNum = parseFloat(Math.round(totalNum * 100) / 100).toFixed(2);

      console.log("totalNum",totalNum )
      this.setState({
        total: totalNum
      })

    this.setState({
      cart: updatedCart
    })
  }//end addtocart
  render() {
    return (
      <div>
        <header className="App-header">
          <h4>Sisaket Thai</h4>
          <img className="hero-image" src="https://www.whyq.sg/images?src=https://s3-ap-southeast-1.amazonaws.com/whyqsg/uploads/stalls/b5e0b7c0ca47415723b28f2d94f9877e.PNG&h=356&w=640&zc=" alt=""/>
          <h3>Menu:</h3>
        </header>
        <div >
          {this.state.cart.length>0 &&
            <Cart cart={this.state.cart} total={this.state.total}/>
          }
        </div>
        <div className="menu-items-list">
          {this.state.items.map((item, index) => {
            return <MenuItem key={index} item={item} addToCart={this.addToCart} />
          })}
          {/* addToCart passed as prop so that cart amout and items can be updated anytime state is updated in this component.
            otherwise, state is set once in Cart and does not update automatically
            */}
        </div>
        <div className="order">
          <Order/>
        </div>
      </div>
    );
  }

  componentDidMount = () => {
    // this.setItemsState()
  }
}

export default HawkerPage;
