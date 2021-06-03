import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import routes from './routes';

import './style.scss';

pageHelp('ump_paidcontent');

ReactDOM.render(routes, document.getElementById('js-react-container'));
