import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';
import './style.scss';

pageHelp('edu-clue');

ReactDOM.render(Routes, document.getElementById('js-react-container'));