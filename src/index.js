import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'
// import Order from './components/Order'
import registerServiceWorker from './registerServiceWorker';
// import firebase from '../firebase.js'
// import { HashRouter } from 'react-router-dom'
// import {Router, Route} from 'react-router';
//
// const dbRefObj = firebase.database().ref().child('restaurants')
// const orderRefObj = firebase.database().ref().child('orders')
// dbRefObj.on('value', snap=>
//   console.log("dbRefObj", snap.val())
// )
// orderRefObj.on('value', snap=>
//   console.log("orderRefObj",snap.val())
// )

//seed db with data



// const {
//   HashRouter,
//   Switch,
//   Route,
//   Link
// } = ReactRouterDOM

ReactDOM.render((
<App />
), document.getElementById('root'));


// ReactDOM.render(<Order />, document.getElementById('order'));
registerServiceWorker();
