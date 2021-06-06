import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';

pageHelp('question-bank');

ReactDOM.render(Routes, document.getElementById('js-react-container'));