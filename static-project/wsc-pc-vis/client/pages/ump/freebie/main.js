import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';

import Routes from './routes';

import './style/index.scss';

pageHelp('ump_paidcontent');

ReactDOM.render(Routes, document.getElementById('js-react-container'));
