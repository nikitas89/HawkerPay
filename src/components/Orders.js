import React, { Component } from 'react';
import firebase from '../firebase.js'
import Order from './order.js'

class OrderList extends Component {
  state = {
    orders : []
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
  var orderRefObj = firebase.database().ref('orders/' + "H01").orderByChild('U_id').equalTo("U03")
orderRefObj? this.setOrders(orderRefObj) :""

}

}

export default OrderList;
