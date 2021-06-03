import React from 'react';
import ReactDOM from 'react-dom';

import pageHelp from 'shared/components/page-help';

import Certificate from './index';

pageHelp('edu-entrollment');

const app = React.createElement(Certificate);

ReactDOM.render(app, document.getElementById('js-react-container'));
