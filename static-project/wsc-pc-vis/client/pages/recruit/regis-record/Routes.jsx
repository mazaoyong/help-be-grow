import React from 'react';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import Record from './containers/Record';

const Routes = (
  <div className="regis-record-container">
    <Router history={hashHistory}>
      <Route path="index" component={Record} />
      <Redirect from="*" to="index" />
    </Router>
  </div>
);

export default Routes;
