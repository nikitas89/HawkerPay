import React, { Component } from 'react';
import '../App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
// import { auth, provider } from './firebase.js'
import HawkerPage from './HawkerPage'
import OrderList from './Orders'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Home} />
          <Route path='/hawker' component={HawkerPage} />
          <Route path='/orders' component={OrderList} />
          {/* <HawkerPage/> */}
        </div>
      </Router>
    )
  }
}
const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)
export default App;
