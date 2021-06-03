import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';
import './styles.scss';
pageHelp('refund_record');

ReactDOM.render(Routes, document.getElementById('js-react-container'));
