import { Popup } from 'vant';
import { QuickOpen } from '@youzan/vis-ui';

import DatetimePicker from './components/datetime-picker';

const getOpenPopup = QuickOpen.quickOpenCustom(Popup);
export const openDatetimePicker = getOpenPopup(DatetimePicker, {
  props: {
    position: 'bottom',
  },
});
