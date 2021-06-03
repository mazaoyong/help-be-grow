import { QuickOpen } from '@youzan/vis-ui';
import App from './index.vue';
import Popup from './Popup.vue';

export const openShareButtonPopup = QuickOpen.quickOpen(Popup);

export const ShareButtonPopup = Popup;

export default App;
