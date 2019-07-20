import React, { Component } from 'react';
import logo from './Assets/xyzptit.png';
import './App.css';
import AdminLogin from './Screen/AdminLogin/AdminLogin'
import StudentLogin from './Screen/StudentLogin/StudentLogin'
import CompanyLogin from './Screen/CompanyLogin/CompanyLogin';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import firebase from 'firebase';
// import * as admin from 'firebase-admin';
// Initialize Firebase
var config = {
  apiKey: "AIzaSyACejKk5XEtHmoStvYQcANB8FqegBK3xpA",
  authDomain: "campus-recrutment-system.firebaseapp.com",
  databaseURL: "https://campus-recrutment-system.firebaseio.com",
  projectId: "campus-recrutment-system",
  storageBucket: "",
  messagingSenderId: "180973490716"
};
firebase.initializeApp(config);


// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://campus-recrutment-system.firebaseio.com"
// });


class App extends Component {
  constructor() {
    super()
    this.state = {
      isAdminSignin: false,
      adminLogin: false,
      studentLogin: false,
      companyLogin: false,
      companies: [],
      students: [],
    }
    // this.adminPageBack = this.adminPageBack.bind(this)
    this.StudentPageBack = this.StudentPageBack.bind(this)
    this.companyPageBack = this.companyPageBack.bind(this)
    this.back = this.back.bind(this)
  }





  //   componentDidMount() {
  //     const { companies, students } = this.state
  //     console.log('componentDidMount')

  //     firebase.database().ref('/companyAccount/').on('child_added', (snapShot) => {
  //         var user = snapShot.val()
  //         var key = snapShot.key
  //         for (var key in user) {
  //             companies.push(user[key])                
  //             this.setState({ companies })
  //         }
  //     })

  //   // console.log(students)
  // }


  companyPageBack() {
    this.setState({ companyLogin: false })
  }

  StudentPageBack() {
    this.setState({ studentLogin: false })
  }

  back() {
    this.setState({ adminLogin: false })
  }

  renderFooter() {
    return (
      <div className="footer">

      </div>
    )
  }

  render() {
    const { adminLogin, studentLogin, companyLogin, isAdminSignin, companies, students } = this.state;
    console.log(students)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <h1 className="App-title">Campus  Recruitment  System</h1> */}
          {!adminLogin && !studentLogin && !companyLogin && <div>
            <button onClick={() => { this.setState({ adminLogin: !adminLogin }) }}>Admin Login</button>
            <button onClick={() => { this.setState({ studentLogin: !studentLogin }) }}>Student Login/SignUp</button>
            <button onClick={() => { this.setState({ companyLogin: !companyLogin }) }}>Company Login</button></div>}
        </header>
        {adminLogin && <AdminLogin allCompanies={companies} back={this.back} />}
        {studentLogin && <StudentLogin back={this.StudentPageBack} />}
        {companyLogin && <CompanyLogin back={this.companyPageBack} />}
        {this.renderFooter()}
      </div>
    );
  }
}

export default App;
