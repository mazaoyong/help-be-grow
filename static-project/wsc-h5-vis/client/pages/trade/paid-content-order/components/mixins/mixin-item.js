export default {
  name: 'mixin-item',

  props: {
    pointsInfo: {
      type: Object,
      default: null,
    },
  },

  computed: {
    usePoints() {
      return !!this.pointsInfo;
    },
    pointsPrice() {
      if (!this.usePoints) {
        return {};
      }
      if (this.pointsInfo.pointsPrice === undefined) {
        this.pointsInfo.pointsPrice = 0;
      }
      if (this.pointsInfo.remainPrice === undefined) {
        this.pointsInfo.remainPrice = 0;
      }
      return {
        points: this.pointsInfo.pointsPrice,
        price: (this.pointsInfo.remainPrice / 100).toFixed(2),
        isFree: this.pointsInfo.remainPrice === 0, // 不用钱只用积分的情况
      };
    },
  },
};
