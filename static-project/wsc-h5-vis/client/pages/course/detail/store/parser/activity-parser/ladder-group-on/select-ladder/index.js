import { QuickOpen } from '@youzan/vis-ui';
import App from './index.vue';

const openSkuPopup = QuickOpen.quickOpen(App);

export default function(cover, ladderPriceMap) {
  return openSkuPopup({
    props: {
      cover,
      ladderPriceMap,
    },
  });
}
