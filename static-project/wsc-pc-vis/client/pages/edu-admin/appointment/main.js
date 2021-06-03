import ReactDOM from 'react-dom';
import Routes from './Routes';
import pageHelp from 'shared/components/page-help';
import './styles/index.scss';

pageHelp('edu-appointment');
ReactDOM.render(Routes, document.getElementById('js-react-container'));
