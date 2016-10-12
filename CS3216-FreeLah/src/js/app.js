import React from 'react/addons';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Views from './views';
import api from './api';
import {Router, Route} from 'react-router';
let injectTapEventPlugin = require('react-tap-event-plugin');

(function () {
  injectTapEventPlugin();
  console.log(Views);
  console.log(api);
  React.render((
    <Router history={createBrowserHistory()}>
      <Route path='/' component={Views.Home}/>
      <Route path='about' component={Views.About}/>
      <Route path='login' component={Views.Login}/>
      <Route path='logout' component={Views.Logout}/>
      <Route path='signup' component={Views.Signup}/>
      <Route path='products/new' component={Views.ProductNew}/>
      <Route path='products/:id' component={Views.Product}/>
      <Route path='activity' component={Views.Activity}/>
    </Router>
  ), document.body);
})();
