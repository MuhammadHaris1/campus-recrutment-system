import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from './App';
import AdminLogin from './Screen/AdminLogin/AdminLogin' ;
import createBrowserHistory from 'history/createBrowserHistory';

const customHistory = createBrowserHistory()

const CustomRoutes = () => (
    <Router history={customHistory}>
        <div>
            <Route exact path='/' component={App} />
            <Route path='/admin-login' component={AdminLogin} />
        </div>
    </Router>
)

export default CustomRoutes