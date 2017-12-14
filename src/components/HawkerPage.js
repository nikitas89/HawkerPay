import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
// import '../App.css';
import '../index.css';
import firebase from '../firebase.js'
import Order from './Order.js'
import {Route,Redirect} from 'react-router-dom'

const dbRefObj = firebase.database().ref().child('hawkers')

class HawkerPage extends Component {
  constructor(props) {
  super(props);
  this.state = {
    items:  [{id: 1, name: "BASIL LEAF RICE", price: 4.50},
              {id: 2, name: "Epic Apple", price: 3.29},
              {id: 3, name: "Awesome Grape", price: 7.49}],
    cart: [],
    total:'',
    H_id: "H2",
    // U_id: "U03",
    U_id: props.U_id || 'U2',
    user:props.loggedIn,
    cartCount : 0,
    hawkerOrderIdCount:'', //refactor and remove
    cartId:0, //check and remove
    cartIndex:null // HID/OID in firebase for HID/UID/unpaid
  }
}
  getId = () => {
   if (!this.state.user) {
     return <Redirect to='/' />
   }else{
     console.log(this.state.user.email);
     const userIdCheck = firebase.database().ref('users').orderByChild('email').equalTo(this.state.user.email)
     userIdCheck.on('value', snap => {
       const existingId = Object.keys(snap.val())[0]
       this.setState({
         U_id: existingId
       })
       console.log(this.state.U_id)
       this.setCartState
      })
   }
  }
  setCartState = (cartItem)=>{

    let getItems = cartItem
    console.log(getItems);
    let totalNum = 0
    getItems.forEach((item)=>{ totalNum += item.quantity*item.price })
      totalNum = parseFloat(Math.round(totalNum * 100) / 100).toFixed(2);
      this.setState({
        total: totalNum,
        cart: getItems,
        cartCount: getItems.length
      })
  }

  setItemsState = ()=>{

    var itemsChange = this.state.items
    var dbRefObj =firebase.database().ref('hawkers/' + this.state.H_id)
   dbRefObj.on('value', snap=>{
     //lookup by resto id.
     itemsChange = snap.val().items
     console.log(itemsChange);
      this.setState({
        items: itemsChange
      })
      console.log(this.state.items);
    })

 }

  addToCart =  (item) =>{
    var cartCount = this.state.cartCount // change to lengt of cart
    var found = false;
     var updatedCart = this.state.cart.map((cartItem) => {
      if (cartItem.name == item.name) {
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

      let oid = this.state.hawkerOrderIdCount +1

      if(this.state.cartIndex){
      firebase.database().ref('orders/' + this.state.H_id +'/'+this.state.cartIndex).set(newOrder)
        //check refactoring to +(this.state.cartIndex ||id)
      }else {
        firebase.database().ref('orders/' + this.state.H_id +'/'+oid).set(newOrder)
      }
} //end addtocart

checkout = ()=>{
  let oid = this.state.hawkerOrderIdCount +1
console.log(oid);
//cart index shd be applied.
console.log(this.state.cartIndex);

  //change to paid
  var orderCORefPayment =
  firebase.database().ref('orders/' + this.state.H_id +'/'+(this.state.cartIndex || oid)).child( 'payment_status')
  orderCORefPayment.set('paid')

  //change to preparing/cooking
  var orderCORef =
  firebase.database().ref('orders/' + this.state.H_id +'/'+(this.state.cartIndex || oid)).child( 'order_status')
  orderCORef.set('preparing')
  var paidOrder = firebase.database().ref('orders/' + this.state.H_id +'/'+this.state.cartIndex)
  console.log(paidOrder);
  paidOrder.on('value', snap=>{
    var paidOrderObj = snap.val()
    var exists = (snap.val() !== null)
    console.log(paidOrderObj);
    if (exists) {
      this.setState({
        cart:[],
        orderComplete:true,
        paidOrder :paidOrderObj
        })
    }else console.log('not found');
  })
  console.log(this.state.cart);
}//end checkout

  render() {
    return (
      <div>
        <header className="App-header">
          <h4></h4>
          {/* <img className="hero-image" src="https://www.whyq.sg/images?src=https://s3-ap-southeast-1.amazonaws.com/whyqsg/uploads/stalls/b5e0b7c0ca47415723b28f2d94f9877e.PNG&h=356&w=640&zc=" alt=""/> */}
        </header>
        <div >
          {this.state.cart.length>0 &&
            <Cart cart={this.state.cart} total={this.state.total} checkout={this.checkout}/>
          }
        </div>
        <div className="menu-items-list">
          {/* <h3>Menu:</h3> */}
          {!this.state.orderComplete &&this.state.items.map((item, index) => {
            return <MenuItem key={index} item={item} addToCart={this.addToCart} />
          })
        }
        </div>
        <div className="order  " >
        {this.state.orderComplete && this.state.paidOrder.order_status &&
          <div className="cart menu-item-card">
            <p>Your order status is: {this.state.paidOrder.order_status}</p>
          </div>
         }
        </div>
      </div>
    );
  }


  componentWillMount = () => {
    this.setItemsState()
    this.getId()
    let H_id = this.state.H_id || 'H2'
    let U_id = this.state.U_id || 'U2'
    //GET RECORD FOR THIS HID
    //SET NUM CHILDREN FOR UPDATING LATER
    var orderRefObjHid =firebase.database().ref('orders/' + H_id)
    orderRefObjHid.on('value', snap=>{
      console.log( "snap 123", snap.val());
      this.setState({
        hawkerOrderIdCount : snap.numChildren()
        })
      })
      var cartItem, orderRefObj
      orderRefObjHid.orderByChild("U_id").equalTo(U_id).on('value', (snap)=> {
        var exists = (snap.val() !== null)
        console.log(H_id,this.state.U_id,exists, snap.val())
        if (exists) {
                    var userOrders = []
                    var removeEmptyEl = snap.val().filter(el => el)
                    // removeEmptyEl
                    var userOrdersObj = snap.val()
                    // console.log(removeEmptyEl, userOrdersObj);
                    var keys = Object.keys(userOrdersObj)
                    // console.log(keys);
                    // console.log(userOrdersObj[keys])
                    keys.length===1?userOrders.push(userOrdersObj):userOrders=userOrdersObj
                    // console.log(userOrders);
                    userOrders.forEach((order, index)=>{
                      // console.log(order)
                      if (order && order.payment_status=="unpaid") {
                          cartItem = order.items
                          // console.log('FOUND UNPAID', order.items, index);
                          this.setState({  cartIndex :index  })
                        }
                        }) //end foreach
                    console.log("cartItem",cartItem, (typeof cartItem))
                    cartItem?  this.setCartState(cartItem) :""
          } //end if

      });
  }//end componentWillMount
}//end class

export default HawkerPage;
