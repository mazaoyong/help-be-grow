import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { createMiddleware } from 'zan-shuai';
import pageHelp from 'shared/components/page-help';

import states from './states';
import createEffects from './effects';
import App from './app';

function configureStore(state) {
  const middlewares = [createMiddleware()];

  /* eslint-disable */
  // @ts-ignore
  if (__DEBUG__) {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
  }
  /* eslint-disable */

  return createStore(state, composeWithDevTools(applyMiddleware(...middlewares)));
}

const store = configureStore(states);
createEffects();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('js-react-container')
);

pageHelp('setting_payback');
