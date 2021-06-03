import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';

import List from './containers/list';

import { ContextProvider } from './reducers/comment';

pageHelp('ump_paidcontent');

ReactDOM.render(
  <ContextProvider>
    <List />
  </ContextProvider>,
  document.getElementById('js-react-container'),
);
