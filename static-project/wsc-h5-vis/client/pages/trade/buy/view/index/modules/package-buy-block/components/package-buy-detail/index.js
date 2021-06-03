import { get } from 'lodash';
import { Popup } from '@youzan/vis-ui';
import PackageBuyDetail from './index.vue';

export const openPackageBuyDetailPopup = param => {
  const num = get(param, 'props.goodsList.length', 0);
  return Popup.getOpenPopup(PackageBuyDetail, {
    props: {
      title: `共${num}件商品`,
      closeable: true,
    },
  })(param);
};
