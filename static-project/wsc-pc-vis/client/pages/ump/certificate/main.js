import ReactDOM from 'react-dom';

import pageHelp from 'shared/components/page-help';

import { isEduBranchStore } from '@youzan/utils-shop';

import alert from './components/alert';

import routes from './routes';

import './styles.scss';

pageHelp('edu-certificate');

ReactDOM.render(routes, document.getElementById('js-react-container'));

if (isEduBranchStore) {
  ReactDOM.render(alert, document.getElementById('js-react-container-alert'));
}
