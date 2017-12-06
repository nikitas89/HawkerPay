import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
import '../App.css';
import firebase from '../firebase.js'
import Order from './Order.js'

const dbRefObj = firebase.database().ref().child('restaurants')
// var hawkerOrderIdCount   = 0
// const orderRefObj = firebase.database().ref().child('orders')

// orderRefObj.on('value', snap=>
// // console.log("orderRefObj with key 1",snap.val())
// console.log("orderRefObj for U01",snap.val())
// //use where child is equal H02
// )

class HawkerPage extends Component {
  constructor(props) {
  super(props);
  this.state = {
    items:  [{id: 1, name: "BASIL LEAF RICE", price: 4.50},
              {id: 2, name: "Epic Apple", price: 3.29},
              {id: 3, name: "Awesome Grape", price: 7.49}],
    cart: [],
    total:'',
    H_id: "H06",
    U_id: "U06",
    cartCount : 0,
    hawkerOrderIdCount:'',
    cartId:0
  };
}

  setCartState = (orderRefObj)=>{  //, hawkerOrderIdCount
    console.log('setting cart state');
    let hid= this.state.H_id
    let uid= this.state.U_id
    //1. shd be blank
    var cartChange = this.state.cart

if (this.state.hawkerOrderIdCount)
{   orderRefObj.on('value', snap=>{
     console.log("orderRefObj", snap.val())
     // var key  = Object.keys(snap.val())
     // cartChange = snap.val()[key].items
     cartChange = snap.val()[hid].items
     console.log("cartChange", cartChange)
     //set with those where child status equals unpaid
      // console.log("this.state.cart",this.state.cart);
      this.setState({
        cart: cartChange
      })
    })}


    //update cart count
  }

  setItemsState = ()=>{
    var itemsChange = this.state.items
   dbRefObj.on('value', snap=>{
     itemsChange = snap.val()["-L-dt-8rmIQ-tSGnShkO"].items
     // console.log("snap val in method 1", snap.val()["-L-dt-8rmIQ-tSGnShkO"].items)
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

    var newOrder ={
      U_id: this.state.U_id,
      items:updatedCart,
      order_status:"unpaid", payment_status:"unpaid"
      }
    console.log("newOrder",newOrder);
    //set to this_order_id or next_order_id if new
    //get order _id of order which is not paid.
    // if(){
    // }else {
    //   firebase.database().ref('orders/' + this.state.H_id +'/'+id).set(newOrder) //make this dynamic
    //
    // }
      let id = this.state.hawkerOrderIdCount +1
    firebase.database().ref('orders/' + this.state.H_id +'/'+id).set(newOrder)

    // firebase.database().ref('orders/' + 3).set(newOrder) //make this dynamic
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
    var that  = this
    var orderRefObjHid =firebase.database().ref().child('orders').orderByKey().equalTo("H06")
    //fix this!
    var orderRefObj = firebase.database().ref().child('orders/' + 'H06').orderByChild('U_id').equalTo("U06")

    orderRefObjHid.on('value', snap=>
      console.log("orderRefObjHid", snap.val())
    )
    let cartItem = {}
    orderRefObj.on('value', snap=>
      {
        console.log("orderRefObj", snap.val())
      if (snap.numChildren()){
        //check for Hid also...
         // cartItem = snap.val().filter(order=>order.payment_status==="unpaid")
      }
    })
    //pass this key to addtocart set method.
    var key  = Object.keys(cartItem)

    firebase.database().ref().child("orders").orderByKey().equalTo("H06").on("value", function(snap) {
      console.log("There are "+snap.numChildren()+" orders");
      that.setState({
        hawkerOrderIdCount : snap.numChildren()
      })

      // this.state.hawkerOrderIdCount = snapshot.numChildren()
      console.log( that.state.hawkerOrderIdCount);
    })
    // console.log(orderRefObjHid.val(), orderRefObjHid.val().length);
    // console.log(orderRefObj.val());
    //.orderByChild('payment_status').equalTo("unpaid")
    //.orderByValue('payment_status')

    this.setItemsState()
    this.setCartState(orderRefObj) //, hawkerOrderIdCount

  }
}

export default HawkerPage;
