import React, { Component } from 'react';
import '../App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import firebase,{ auth, provider } from '../firebase.js'
import HawkerPage from './HawkerPage'
import OrderList from './Orders'


class App extends Component {
  constructor () {
   super()
   this.state = {
     inputs: [],
     redirect: false,
     user: null
     }
   }

   logout () {
     auth.signOut()
       .then(() => {
         this.setState({
           user: null,
           redirect: true
         })
       })
   }
   login () {
     auth.signInWithPopup(provider)
       .then((result) => {
         const user = result.user
         this.setState({
           user
         })

         var userRefObj =firebase.database().ref('users')
         const userIdCheck = firebase.database().ref('users').orderByChild('email').equalTo(user.email)
         userIdCheck.once('value').then(snap => {
          if (snap.val() === null) {
            // console.log('no existing email address')
            userRefObj.once('value').then(subsnap => {
              let newId = 'U' + (subsnap.numChildren() + 1)
              this.setState({
                id: newId
              })
              userRefObj.child(newId).set({
                email: user.email
              })
            })
          } else {
            let existingId = Object.keys(snap.val())[0]
            console.log('existingId', existingId)
            this.setState({
              id: existingId
            })
          }
          // console.log('preview of userIdCheck', snap.val())
       })//end sub then
   })//end outer then
}//end fn
  render() {
    return (
      <Router>
        <div className="App ">



          <div className="navbar">
            <Link to='/' >Home</Link>
            <Link to='/hawker' >Hawker</Link>
            <Link to='/orders' >Orders</Link>
            {this.state.user
              ? <Link to='/' onClick={() => this.logout()}>Log Out</Link>
              : <Link to='/' onClick={() => this.login()}>Log In</Link>
            }
            </div>
          

          <Route exact path='/' component={Home} />
          <Route path='/hawker' render={() => <HawkerPage loggedIn={this.state.user} U_id={this.state.id} />} />
          <Route path='/orders' render={() => <OrderList loggedIn={this.state.user} U_id={this.state.id} />} />
        </div>
      </Router>
    )
  }
  componentDidMount () {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      }
    })
  }
}//end App


const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)




export default App;
