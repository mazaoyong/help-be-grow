import configs from '../../configs';

export default {
  data() {
    return {
      packageData: {
        // 0: 固定套餐，1: 搭配套餐
        packageType: -1,
        imageUrl: '',
        title: '',
        packagePrice: 0,
        originPrice: 0,
        decrease: 0,
      },
    };
  },

  methods: {
    parsePackageData(posterData) {
      const {
        pictureUrl = '',
        originPrice = 0,
        price = 0,
        title = '',
        type,
        decrease,
      } = posterData;

      this.packageData = {
        imageUrl: pictureUrl,
        originPrice: originPrice,
        packagePrice: price,
        title: title,
        packageType: type,
        decrease,
      };
    },

    getPackageConfig(avatar = '') {
      const buyer = _global.visBuyer;
      const avatarUrl = avatar || buyer.finalAvatar;
      const username = buyer.finalUsername;
      const {
        imageUrl,
        title,
        packagePrice,
        originPrice,
        decrease,
        packageType,
      } = this.packageData;

      return configs.package(
        packageType,
        avatarUrl,
        username,
        imageUrl,
        title,
        packagePrice,
        originPrice,
        this.qrcodeUrl,
        decrease
      );
    },
  },
};
