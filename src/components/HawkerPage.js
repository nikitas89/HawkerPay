import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
import '../App.css';
import firebase from '../firebase.js'
import Order from './Order.js'

const dbRefObj = firebase.database().ref().child('restaurants')
// const orderRefObj = firebase.database().ref().child('orders')

// dbRefObj.on('value', snap=>
//   console.log("dbRefObj", snap.val())
// )

//set id and key for cart items using counter


// orderRefObj.on('value', snap=>
// // console.log("orderRefObj with key 1",snap.val())
// console.log("orderRefObj for U01",snap.val())
// //use where child is equal H02
// )

class HawkerPage extends Component {
  state = {
    //load items from db
    items:  [{id: 1, name: "BASIL LEAF RICE", price: 4.50},
              {id: 2, name: "Epic Apple", price: 3.29},
              {id: 3, name: "Awesome Grape", price: 7.49}],
    cart: [],
    total:'',
    H_id: "H05",
    U_id: "U01",
    cartCount : 0
  }

  setCartState = (orderRefObj)=>{
    console.log('setting cart state');
    let hid= this.state.H_id
    let uid= this.state.U_id
    //1. shd be blank
    var cartChange = this.state.cart


   orderRefObj.on('value', snap=>{
     console.log("orderRefObj", snap.val())
     var key  = Number(Object.keys(snap.val()))
     console.log("key",key);
     cartChange = snap.val()[key].items
     console.log("cartChange", cartChange)
     //set with those where child status equals unpaid
      // console.log("this.state.cart",this.state.cart);
    })
    this.setState({
      // cart: cartChange
    })
    //update cart count
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
    var cartCount = this.state.cartCount // change to lengt of cart
    var found = false;
     var updatedCart = this.state.cart.map((cartItem) => {
      if (cartItem.name === item.name) {
        found = true;
        cartItem.quantity++;
      }
      return cartItem;
    })

    if (!found) {  cartCount++
      updatedCart.push({id: cartCount, name: item.name, price: item.price, quantity: 1, key:cartCount})
    }

    let totalNum = 0
    updatedCart.forEach((item)=>{
        totalNum += item.quantity*item.price
      })
      totalNum = parseFloat(Math.round(totalNum * 100) / 100).toFixed(2);
      this.setState({
        total: totalNum,
        cart: updatedCart,
        cartCount: cartCount
      })
      console.log("", this.state.cart);
//creating new order each time. refactor to only create new cart if !found, otherwise lookup those other details from db and assign here, OR best, just update items directly for a given order
    var newOrder ={ H_id: this.state.H_id,
      U_id: this.state.U_id,
      items:updatedCart,
      order_status:"unpaid", payment_status:"unpaid"
      }
    console.log("newOrder",newOrder);
    //set to this_order_id or next_order_id if new

    firebase.database().ref('orders/' + 2).set(newOrder) //make this dynamic

} //end addtocart


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
var orderRefObj = firebase.database().ref().child('orders').orderByChild('U_id').equalTo("U01")
console.log(typeof orderRefObj);
    this.setItemsState()
    this.setCartState(orderRefObj)

  }
}

export default HawkerPage;
