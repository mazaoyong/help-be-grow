import React from 'react';
import ReactDOM from 'react-dom';
import Content from './index';
import pageHelp from 'shared/components/page-help';

pageHelp('ump_paidcontent');

ReactDOM.render(<Content />, document.getElementById('js-react-container'));
