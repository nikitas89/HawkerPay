import React, { Component } from 'react';
import firebase from '../firebase.js'

const dbRefObj = firebase.database().ref().child('orders')

class Order extends Component {
  state = {
    order : {}
  }

 setOrders = ()=>{
   var orderChange = this.state.order
   dbRefObj.on('value', snap=>{
     orderChange = snap.val().order
     this.setState({
       order: orderChange
     })
     console.log(this.state);
   })
 }

  render() {
    return (
      <div>
        <h1>hihihihi</h1>
        {/* {this.state.order.items.map((item, index)=>{
          return {item}
        })} */}
        {this.state.order.order_status}
      </div>
    );
  }

componentDidMount = () => {
  // console.log('this is mounted');
  this.setOrders()
}

}

export default Order;
