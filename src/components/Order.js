import React, { Component } from 'react';
import firebase from '../firebase.js'


class Order extends Component {
  state = {
    orders : []
  }

 setOrders = (orderRefObj)=>{
var ordersItems = []
   orderRefObj.on('value', snap=>{
     var removeEmptyEl = snap.val().filter(el => el)
     removeEmptyEl.forEach(order=>{
       if(order.payment_status==='paid'){
         console.log(order.items[0]);
         ordersItems.push(order.items)
       }
     })

     this.setState({
       orders: ordersItems
     })
     // console.log(this.state.orders);
   })
 }

  render() {
    return (
      <div>
        <h1>hihihihi</h1>
        {this.state.orders.map(order=>{
          // console.log(order)
           // order.map(item=> <p>{item.name}</p>
           // )
        })
        }

      </div>
    );
  }

componentDidMount = () => {
  // console.log('this is mounted');
  var orderRefObj = firebase.database().ref('orders/' + "H01").orderByChild('U_id').equalTo("U03")
orderRefObj? this.setOrders(orderRefObj) :""

}

}

export default Order;
