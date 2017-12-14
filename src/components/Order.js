import React, { Component } from 'react';
import '../index.css';
class Order extends Component {

  render() {
    console.log(this.props.order);
    var orderItems = this.props.order
    return (
      <div className="">
      {orderItems.map((item,index)=>{
        return (
          <div className="menu-items-card">
                <div className="item-content">
                  <div className="top-line">
                    {/* <div className="item-name" >
                      {item.name}
                    </div>
                    <div className="item-dots">
                      <div className="dots"></div>
                    </div>
                    <div className="item-price">
                      {item.quantity}
                    </div> */}
                <p key={index}>
                  <span>{item.quantity} </span><span>{item.name} </span>
                </p>
              </div><div></div></div></div>

        )
      })
      }
    </div>
    );
  }
}

export default Order;
