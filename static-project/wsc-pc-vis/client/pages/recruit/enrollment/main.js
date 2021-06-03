import React from 'react';
import ReactDOM from 'react-dom';

import pageHelp from 'shared/components/page-help';

import Enrollment from './index';

pageHelp('edu-entrollment');

const app = React.createElement(Enrollment);

ReactDOM.render(app, document.getElementById('js-react-container'));
