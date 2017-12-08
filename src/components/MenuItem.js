import React, { Component } from 'react';

import '../App.css';
class MenuItem extends Component {

  addToCart = () => {
     this.props.addToCart(this.props.item);
   }

  render() {
    return (
      <div>
        <div className="menu-item">
          <div>
            <div className="add-button">
              <button type="button" name="button" onClick={this.addToCart}>Add</button>
            </div>
            <div className="item-name" >
              <h3>{this.props.item.name}</h3>
            </div>
            <div className="item-price">
              <h3> {this.props.item.price}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MenuItem;
