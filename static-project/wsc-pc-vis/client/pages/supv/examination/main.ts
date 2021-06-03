import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import routes from './routes';

pageHelp('examination');

ReactDOM.render(routes, document.getElementById('js-react-container'));
