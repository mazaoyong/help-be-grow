import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import Edit from './index';

pageHelp('ump_paidcontent');

ReactDOM.render(<Edit />, document.getElementById('js-react-container'));
