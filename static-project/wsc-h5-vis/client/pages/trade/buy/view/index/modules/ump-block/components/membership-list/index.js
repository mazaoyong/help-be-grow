import { Popup } from '@youzan/vis-ui';
import MembershipList from './index.vue';

export const openMembershipListPopup = Popup.getOpenPopup(MembershipList, {
  props: {
    title: '会员优惠',
    closeable: true,
    buttons: [
      {
        text: '不使用会员优惠',
        onClick(ctx) {
          ctx.$emit('select', '', ctx.onClose);
        },
      },
    ],
  },
});
