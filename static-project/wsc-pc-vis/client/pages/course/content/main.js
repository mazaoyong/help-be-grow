import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';

import './style/index.scss';

pageHelp('ump_paidcontent');

ReactDOM.render(Routes, document.getElementById('js-react-container'));
