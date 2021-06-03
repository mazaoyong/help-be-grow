import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';
import './styles/index.scss';

pageHelp('course-evaluation');

ReactDOM.render(Routes, document.getElementById('js-react-container'));
