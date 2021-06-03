import ReactDOM from 'react-dom';
import Routes from './routes';
import pageHelp from 'shared/components/page-help';
import { visitTracker } from 'fns/web-tracker';

pageHelp('tuition-offset');

visitTracker({
  pageType: 'TuitionOffset',
  eventName: '进入攒学费页面',
});

ReactDOM.render(Routes, document.getElementById('js-react-container'));
