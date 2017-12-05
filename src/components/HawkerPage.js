import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
import '../App.css';
import firebase from '../firebase.js'
import Order from './Order.js'

const dbRefObj = firebase.database().ref().child('restaurants')
const orderRefObj = firebase.database().ref().child('orders')
// dbRefObj.on('value', snap=>
//   console.log("dbRefObj", snap.val())
// )

//set id and key for cart items using counter
let cartCount  = 0
// let newOrderRef = orderRefObj.push()
// let orderRefId = newOrderRef.key
// console.log("newOrderRef", "orderRefId");
// console.log(newOrderRef, orderRefId);
orderRefObj.on('value', snap=>
// console.log("orderRefObj with key 1",snap.val())
console.log("orderRefObj with key 1",snap.val())
//use where child is equal H02
)

class HawkerPage extends Component {
  state = {
    //load items from db
  items:  [{id: 1, name: "BASIL LEAF RICE", price: 4.50},
            {id: 2, name: "Epic Apple", price: 3.29},
            {id: 3, name: "Awesome Grape", price: 7.49}],
  cart: [],
  total:''
  }
  setCartState = ()=>{
    var cartChange = this.state.cart
   orderRefObj.on('value', snap=>{
     cartChange = snap.val()[0]
     // console.log("snap val in method 1", snap.val()["-L-W3ZtnZCvHzeYiqoRA"].items)
     //set with those where child status equals unpaid
      this.setState({
        cart: cartChange
      })
      console.log("this.state.cart",this.state.cart);
    })
  }

  setItemsState = ()=>{
    var itemsChange = this.state.items
   dbRefObj.on('value', snap=>{
     itemsChange = snap.val()["-L-W3ZtnZCvHzeYiqoRA"].items
     // console.log("snap val in method 1", snap.val()["-L-W3ZtnZCvHzeYiqoRA"].items)
      this.setState({
        items: itemsChange
      })
      // console.log(this.state.items);
    })
 }

  addToCart =  (item) =>{
//id and key for cart items
    console.log("state cart", this.state.cart);
    console.log(cartCount);
    console.log("item1", item);
    var found = false;
    var updatedCart ={H_id: "H02",items:{}, order_status:"unpaid", payment_status:"unpaid"}
     var updatedCartItems = this.state.cart.map((cartItem) => {
      if (cartItem.name === item.name) {
        found = true;
        cartItem.quantity++;
        return cartItem;
      } else {
        return cartItem;
      }
    })
    updatedCart.items = updatedCartItems

    if (!found) {
      cartCount++
      // updatedCart.push(
      // { items:
      //   {id: cartCount, name: item.name, price: item.price, quantity: 1, key:cartCount}
      // }
      // )
      updatedCart =
      { H_id: "H02",
        items:
      { 0:
        {id: cartCount, name: item.name, price: item.price, quantity: 1, key:cartCount}
      }
        , order_status:"unpaid", payment_status:"unpaid"
      }
    }
    console.log("updatedCart",updatedCart);
    //total sum of cart
    let totalNum = 0
    // updatedCart.items.forEach((item)=>{
    //     totalNum += item.quantity*item.price
    //   })
    //   totalNum = parseFloat(Math.round(totalNum * 100) / 100).toFixed(2);
    //
    //   // console.log("totalNum",totalNum )
      this.setState({
        total: totalNum
      })
      console.log("updatedCart 1",updatedCart);
        // firebase.database().ref('orders/' + 2).set(
        // updatedCart
        // )
      // orderRefObj.push(updatedCart)
    this.setState({
      cart: updatedCart.items
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
          {/* <Order/> */}
        </div>
      </div>
    );
  }

  componentWillMount = () => {

    this.setItemsState()
    // this.setCartState()

  }
}

export default HawkerPage;
