import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import LiveManageEntry from './blocks';

pageHelp('ump_paidcontent');

ReactDOM.render(<LiveManageEntry />, document.getElementById('js-react-container'));
