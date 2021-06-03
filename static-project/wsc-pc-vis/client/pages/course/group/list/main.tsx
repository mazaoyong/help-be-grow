import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import List from './ListPage';
import './styles.scss';
pageHelp('course_group');

ReactDOM.render(<List />, document.getElementById('js-react-container'));
