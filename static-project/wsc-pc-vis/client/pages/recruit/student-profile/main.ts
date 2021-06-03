import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';
import './styles/common.scss';
import '../../../sass/common/operator-splitor.scss';
pageHelp('student-profile');

ReactDOM.render(Routes, document.getElementById('js-react-container'));
