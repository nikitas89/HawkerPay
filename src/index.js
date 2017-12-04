import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'
// import Order from './components/Order'
import registerServiceWorker from './registerServiceWorker';
// import { HashRouter } from 'react-router-dom'
// import {Router, Route} from 'react-router';

// const {
//   HashRouter,
//   Switch,
//   Route,
//   Link
// } = ReactRouterDOM

ReactDOM.render((
<App />
), document.getElementById('root'));
{/* <Router>
  <Route path="/" component={App}/>
  <Route path="/order" component={Order}/>
</Router> */}

// ReactDOM.render(<Order />, document.getElementById('order'));
registerServiceWorker();
