import ReactDOM from 'react-dom';
import routes from './routes';
import pageHelp from 'shared/components/page-help';

pageHelp('teachers');
ReactDOM.render(routes, document.getElementById('js-react-container'));
