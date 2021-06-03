import { getThemeColor } from '@youzan/vue-theme-plugin';
import { Tips } from '@youzan/vis-ui';

export const openMembershipTipsPopup = () => {
  const mainColor = getThemeColor('main');

  Tips.openTipsPopup({
    props: {
      title: '会员优惠说明',
      content: [
        '1、会员优惠价仅对商家设置了会员优惠的商品生效，普通商品不享受；',
        '2、当会员折扣商品参与限时折扣时，系统将选择其中较低的价格下单结算；',
        '3、会员包邮为订单包邮，当订单中有砍价、秒杀、拼团、优惠套餐活动时，会员包邮失效。',
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
