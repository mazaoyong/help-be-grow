import Tany from '@youzan/tany-react';
import root from './root';
import pageHelp from 'shared/components/page-help';

pageHelp('supv_homework');

Tany.createApp({
  el: '#js-react-container',
  root,
});
