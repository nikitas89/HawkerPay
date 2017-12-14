import React, { Component } from 'react';

// import '../App.css';
import '../index.css';
// import '../index.scss';
// require ('../index.scss');
class MenuItem extends Component {

  addToCart = () => {
     this.props.addToCart(this.props.item);
   }

  render() {
    return (
      <div>
        <div className=" menu-item-card ">
          <div className="item-content">
            <div className="top-line">
              <div className="item-name" >
                {this.props.item.name}
              </div>
              <div className="item-dots">
                <div className="dots"></div>
              </div>
              <div className="item-price">
                {this.props.item.price}
              </div>
              <div className="add-button ">
                <button className="ml-3 px-1 rounded"  type="button" name="button" onClick={this.addToCart}>Add</button>
              </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MenuItem;
