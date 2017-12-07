import React, { Component } from 'react';
import firebase from '../firebase.js'
import Order from './Order.js'
import {Redirect} from 'react-router-dom'

class OrderList extends Component {
  state = {
    orders : []
  }
  getId () {
   if (!this.props.user) {
     return <Redirect to='/' />
   }

   const userIdCheck = firebase.database().ref('users').orderByChild('email').equalTo(this.state.user.email)
   userIdCheck.on('value', snap => {
     const existingId = Object.keys(snap.val())[0]
     this.setState({
       id: existingId
     })
   }
   )
  }
 setOrders = (orderRefObj)=>{
   var ordersItems = []
   orderRefObj.on('value', snap=>{
     var removeEmptyEl = snap.val().filter(el => el)
     removeEmptyEl.forEach(order=>{
       if(order.payment_status==='paid'){
         ordersItems.push(order.items)
       }
     })
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
            <p>Order #{index}</p>
             <Order key={index} order={order} />
            </div>)
        })
        }
      </div>
    )
  }

  componentDidMount = () => {
    // console.log('this is mounted');
    var orderRefObj = firebase.database().ref('/orders/' + 'H1').orderByChild('U_id').equalTo(this.props.U_id)
    orderRefObj? this.setOrders(orderRefObj) :""
    this.getId()
  }

}

export default OrderList;
