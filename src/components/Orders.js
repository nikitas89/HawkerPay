import React, { Component } from 'react';
import firebase from '../firebase.js'
import Order from './Order.js'
import {Redirect} from 'react-router-dom'
import '../index.css';
class OrderList extends Component {
  constructor (props) {
   super(props)
   this.state = {
     orders : [],
     U_id: props.U_id ||'U2',
     user : props.loggedIn
     }
   }

  getId () {
    console.log('getid');
   if (!this.state.user) {
     return <Redirect to='/' />
   }
   const userIdCheck = firebase.database().ref('users').orderByChild('email').equalTo(this.state.user.email)
   userIdCheck.on('value', snap => {
     const existingId = Object.keys(snap.val())[0]
     this.setState({
       U_id: existingId
     })
     console.log(this.state.U_id, existingId);
   })
  }
 setOrders = ()=>{
   var orderRefObj = firebase.database().ref('/orders/' + 'H2').orderByChild('U_id').equalTo(this.state.U_id)

   var ordersItems = []
   orderRefObj.on('value', snap=>{
    var exists = (snap.val() !== null)
    console.log(this.state.U_id,exists, snap.val(), typeof snap.val())
      if (exists) {
        var userOrders = []
        var userOrdersObj = snap.val()
        var keys = Object.keys(userOrdersObj)
        console.log(keys);
        // console.log(userOrdersObj[keys])
        keys.length===1?userOrders.push(userOrdersObj):userOrders=userOrdersObj
        //add filter
        userOrders.forEach((order, index)=>{
          console.log(order)
          // var thisKey = Object.keys(order)
          // console.log(order[thisKey])
          if (order.payment_status==="paid") {
              ordersItems.push(order.items)
              console.log('FOUND PAID');
              // this.setState({  cartIndex :Number(thisKey[0])  })
            }
        }) //end foreach
      }

   this.setState({orders: ordersItems})
   })
 }

  render() {
    // console.log(this.state.orders);
    return (
      <div>
        <h1>All My Orders</h1>
        {this.state.orders.map((order, index)=>{
        return (  <div key={index} className="each-order">
            <h4>Order #{index}</h4>
             <Order key={index} order={order} />
            </div>)
        })
        }
      </div>
    )
  }

  componentDidMount = () => {
    // console.log('this is mounted');
    this.getId()
    this.setOrders()
    // var orderRefObj = firebase.database().ref('/orders/' + 'H1').orderByChild('U_id').equalTo(this.state.U_id)
    // console.log(orderRefObj);

    // orderRefObj? this.setOrders(orderRefObj) :""
  }

}

export default OrderList;
