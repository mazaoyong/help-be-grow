import React from 'react';
import ReactDOM from 'react-dom';
import Manage from './ManagePage';
import pageHelp from 'shared/components/page-help';
import './styles.scss';
pageHelp('course_group');

ReactDOM.render(<Manage />, document.getElementById('js-react-container'));
