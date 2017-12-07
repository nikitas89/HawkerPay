import React, { Component } from 'react';
import MenuItem from './MenuItem'
import Cart from  './Cart'
import '../App.css';
import firebase from '../firebase.js'
// import Order from './Order.js'
import {Redirect} from 'react-router-dom'

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
    H_id: "H1",
    // U_id: "U03",
    U_id: props.U_id,
    user:props.loggedIn,
    cartCount : 0,
    hawkerOrderIdCount:'', //refactor and remove
    cartId:0, //check and remove
    cartIndex:null // HID/OID in firebase for HID/UID/unpaid
  }
}
  getId = () => {
    console.log("1234")
    console.log(!this.state.user)
   if (!this.state.user) {
     console.log('user does not exist!!6786786')
     return <Redirect to='/' />
   }else{
  console.log("zyx")
     const userIdCheck = firebase.database().ref('users').orderByChild('email').equalTo(this.state.user.email)
     userIdCheck.on('value', snap => {
       const existingId = Object.keys(snap.val())[0]
       this.setState({
         U_id: existingId
       })
       console.log(this.state.U_id)
       this.setCartState
     }
   )
   console.log("1234")
   }

  }
  setCartState = (cartItem)=>{  //, hawkerOrderIdCount
    console.log('setting cart state');
    // let hid= this.state.H_id
    // let uid= this.state.U_id
    //cartItem is the cart from db. this method runs only when there is existing cart.

    let getItems = cartItem.items
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
   dbRefObj.on('value', snap=>{
     //lookup by resto id.
     itemsChange = snap.val()[this.state.H_id].items
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

  //change to paid
  var orderCORefPayment =
  firebase.database().ref('orders/' + this.state.H_id +'/'+(this.state.cartIndex || oid)).child( 'payment_status')
  orderCORefPayment.set('paid')

  //change to preparing/cooking
  var orderCORef =
  firebase.database().ref('orders/' + this.state.H_id +'/'+(this.state.cartIndex || oid)).child( 'order_status')
  orderCORef.set('preparing')
}//end checkout

  render() {
    return (
      <div>
        <header className="App-header">
          <h4>Sisaket Thai</h4>
          {/* <img className="hero-image" src="https://www.whyq.sg/images?src=https://s3-ap-southeast-1.amazonaws.com/whyqsg/uploads/stalls/b5e0b7c0ca47415723b28f2d94f9877e.PNG&h=356&w=640&zc=" alt=""/> */}
          <h3>Menu:</h3>
        </header>
        <div >
          {this.state.cart &&
            <Cart cart={this.state.cart} total={this.state.total} checkout={this.checkout}/>
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
    this.getId()
    let H_id = this.state.H_id
    //GET RECORD FOR THIS HID
    //SET NUM CHILDREN FOR UPDATING LATER
    var orderRefObjHid =firebase.database().ref('orders/' + H_id)
    orderRefObjHid.on('value', snap=>{
        // console.log("orderRefObjHid", snap.val())
      this.setState({
        hawkerOrderIdCount : snap.numChildren()
        })
      })
    orderRefObjHid.child('U03').once('value', function(snap) {
      var exists = (snap.val() !== null);
      console.log(exists)
      });

    //GET RECORD FOR THIS UID + HID
    var orderRefObj
    var exists = true
    try{
      orderRefObj = firebase.database().ref('orders/' + H_id).orderByChild('U_id').equalTo(this.state.U_id)
      }catch(e){
        // console.log(e)
        exists = false
      }

    var cartItem

    if (exists) {
      orderRefObj.on('value', snap=>{
            console.log("orderRefObj 1", snap.val())
            if (snap.numChildren())
              {
                //add index too, and save that index
                  snap.val().forEach((item, index)=>{
                  if (item.payment_status==="unpaid") {
                      cartItem = item
                      this.setState({  cartIndex :index  })
                    }
                    }) //end foreach
                // console.log("cartItem",cartItem, (typeof cartItem))
                cartItem?  this.setCartState(cartItem) :""
              }//end snap num
        }) //end snap
      } //end if
    // this.setItemsState()


  }//end componentWillMount
}//end class

export default HawkerPage;
