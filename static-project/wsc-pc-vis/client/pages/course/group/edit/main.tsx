import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Creator from './pages/creator';
import { store } from '@decorate-components/sdk';

import './style.scss';

ReactDOM.render(
  <Provider store={store}>
    <Creator />
  </Provider>,
  document.getElementById('course-group-decorate')
);
