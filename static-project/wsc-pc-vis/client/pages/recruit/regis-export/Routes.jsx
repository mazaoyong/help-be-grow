import React from 'react';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import Export from './containers/Export';

const Routes = (
  <div className="regis-record-container">
    <Router history={hashHistory}>
      <Route path="index" component={Export} />
      <Redirect from="*" to="index" />
    </Router>
  </div>
);

export default Routes;
