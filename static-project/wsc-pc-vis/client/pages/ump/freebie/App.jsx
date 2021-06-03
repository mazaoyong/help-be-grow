import React from 'react';
import { Router, hashHistory, Route, Redirect } from 'react-router';

import List from './containers/list';
import Edit from './containers/edit';
import Test from './containers/test';

export default function App() {
  return (
    <Router history={hashHistory}>
      <Route
        path="list/:type"
        component={List}
      />
      <Route
        path="add"
        component={Edit}
      />
      <Route
        path="edit/:id"
        component={Edit}
      />
      <Route
        path="view/:id"
        component={Edit}
      />
      <Route
        path="test"
        component={Test}
      />
      <Redirect from="*" to="list/3" />
    </Router>
  );
}
