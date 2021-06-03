import { createElement } from 'react';
import { render } from 'react-dom';
import pageHelp from 'shared/components/page-help';

import App from './index';

pageHelp('edu-refund');

const element = createElement(App);

render(element, document.getElementById('js-react-container'));
