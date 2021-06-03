import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';

import routes from './routes';
import './styles.scss';

pageHelp('edu-course-summary');

ReactDOM.render(routes, document.getElementById('js-react-container'));
