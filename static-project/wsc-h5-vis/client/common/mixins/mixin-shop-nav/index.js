import $ from 'zepto';
import { getShopNav } from './api';

const HAS_PADDING_STYLE = [1, 2, 3, 5];

export default {
  data() {
    return {
      shopNavFetched: false,
      shopNavData: {},
    };
  },

  computed: {
    hasPadding() {
      return HAS_PADDING_STYLE.indexOf(+this.shopNavData.nav_style) > -1;
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.hasPadding) {
      $('body').css({ paddingBottom: 0 });
    }
    next();
  },

  created() {
    getShopNav().then(data => {
      // 未设置店铺导航，不执行后续逻辑
      if (!data) return;

      this.shopNavData = data;
      if (this.hasPadding) {
        $('body').css({ paddingBottom: 50 });
      }
      this.shopNavFetched = true;
    });
  },
};
