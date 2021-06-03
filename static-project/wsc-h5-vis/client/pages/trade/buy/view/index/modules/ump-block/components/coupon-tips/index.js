import { getThemeColor } from '@youzan/vue-theme-plugin';
import { Tips } from '@youzan/vis-ui';

export const openCouponTipsPopup = () => {
  const mainColor = getThemeColor('main');

  Tips.openTipsPopup({
    props: {
      title: '优惠券说明',
      content: [
        '【优惠券】栏展示的优惠金额为本单通过优惠券实际减免的金额，当本单使用的是无门槛优惠券时，实际减免金额为该优惠券在可用商品上的最大可减免金额。',
      ],
      buttonColor: mainColor,
    },
    on: {
      click(self) {
        self.$emit('close');
      },
    },
  });
};
