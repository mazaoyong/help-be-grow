import PackageEntry from './index';

export default {
  components: {
    PackageEntry,
  },

  data() {
    return {
      hasPackage: false,
      packageAlias: '',
      packageData: {},
      packageType: 0,
      packageNum: 1,
      packageGoodsList: [],
      packageGoodsNum: 0,
      packageDiscountPrice: 0,
    };
  },

  computed: {
    showPackageEntry() {
      return !(this.$page.isOwned || this.$page.isPaid) && this.hasPackage;
    },
  },

  watch: {
    packageData(newV) {
      if (newV) {
        this.parsePackageData(newV);
      }
    },
  },

  beforeCreate() {
    this.$page = this.mixinPackage = this;
  },

  methods: {
    parsePackageData({ activity = {}, goodsList = [], decrease = 0, totalNum = 1 }) {
      this.packageType = activity.type;
      this.packageGoodsList = goodsList.slice(0, 3);
      this.packageGoodsNum = goodsList.length;
      this.packageDiscountPrice = decrease;
      this.packageAlias = activity.alias;
      this.packageNum = totalNum;

      this.hasPackage = !!this.packageGoodsNum;
    },
  },
};
