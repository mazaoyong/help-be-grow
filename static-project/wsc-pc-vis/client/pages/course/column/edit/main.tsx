import React from 'react';
import ReactDOM from 'react-dom';
import Edit from './index';
import pageHelp from 'shared/components/page-help';

pageHelp('ump_paidcontent');

ReactDOM.render(<Edit />, document.getElementById('js-react-container'));
