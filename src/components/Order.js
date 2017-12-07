import React, { Component } from 'react';


class Order extends Component {
  // state = {
  //
  // }

  render() {
    console.log(this.props.order);
    var orderItems = this.props.order
    return (
      <div>
      {orderItems.map((item,index)=>{
        return (
          <p key={index}><span>{item.name} </span><span>{item.quantity} </span></p>
        )
      })
      }
    </div>
    );
  }
}

export default Order;
