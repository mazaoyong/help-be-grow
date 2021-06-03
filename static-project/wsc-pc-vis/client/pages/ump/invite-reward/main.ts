import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import routes from './routes';

import './style.scss';

pageHelp('ump_paidcontent');

window.Logger && window.Logger.log({
  et: 'display',
  ei: 'enterpage',
  en: '进入活动列表页',
  pt: 'inviteRewardBack',
  params: {
    from: window.Logger.rurl,
  },
});

ReactDOM.render(routes, document.getElementById('js-react-container'));
