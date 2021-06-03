import { Popup } from '@youzan/vis-ui';
import InfoCollectForm from './main';

export const openCollectInfoPopup = Popup.getOpenPopup(InfoCollectForm, {
  props: {
    title: '请填写报名信息',
    closeable: true,
  },
});

/**
 * 支持自定义props
 * @param {*} props
 */

export const openCollectInfoPopupHOF = (props = {}) => Popup.getOpenPopup(InfoCollectForm, {
  props: {
    title: '请填写报名信息',
    closeable: true,
    ...props,
  },
});
