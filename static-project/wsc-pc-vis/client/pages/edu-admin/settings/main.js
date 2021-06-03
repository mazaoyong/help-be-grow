import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import Routes from './routes';
import './index.scss';

pageHelp('course-manage');

ReactDOM.render(Routes, document.getElementById('js-react-container'));
