export default {
  props: {

  },
  computed: {
    hasPromotion() {
      return false;
    },
    /**
     * 4：已参团
     * 5：未参团
     * 6：会员折扣
     */
    promotionState() {
      if (this.hasGroupon) {
        if (this.inGroupon) {
          return 4;
        } else {
          return 5;
        }
      } else if (this.isVip) {
        if (this.isVipFree) {
          return 1;
        } else {
          return 6;
        }
      } else {
        return 3;
      }
    },
    customText() {
      return [
        '已下架',
        this.defaultPaidText,
        '查看专栏',
        this.defaultUnPaidText,
        '查看我的团',
        this.defaultGrouponText,
        this.defaultVipText,
      ][this.state];
    },
    defaultPaidText() {
      return '';
    },
    defaultUnPaidText() {
      return '';
    },
    defaultGrouponText() {
      return '';
    },
    defaultVipText() {
      return '';
    },
  },
};
