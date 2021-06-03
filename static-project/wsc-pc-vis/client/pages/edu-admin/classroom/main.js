import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import './styles.scss';

import App from './App';

pageHelp('course-manage');

ReactDOM.render(<App />, document.getElementById('js-react-container'));
