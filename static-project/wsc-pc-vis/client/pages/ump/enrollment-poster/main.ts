import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import routes from './routes';
import './container/style.scss';

pageHelp('enrollment-poster');

ReactDOM.render(routes, document.getElementById('js-react-container'));
