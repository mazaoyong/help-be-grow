import ReactDOM from 'react-dom';
import { isEduBranchStore } from '@youzan/utils-shop';
import alert from './components/alert';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';
import './style.scss';

pageHelp('rewards');
ReactDOM.render(Routes, document.getElementById('js-react-container'));

if (isEduBranchStore) {
  ReactDOM.render(alert, document.getElementById('js-react-container-alert'));
}
