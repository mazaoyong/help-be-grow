import isEmpty from 'lodash/isEmpty';
import apis from 'pct/api';

export default {
  name: 'mixin-promotion',

  data() {
    return {
      hasPromotion: false,
      promotionData: {},
      promotionButtonInfo: {},
      activityBannerInfo: {},
      isShowActivityBanner: false,
    };
  },

  methods: {
    fetchPromotion(promotionAlias) {
      return apis.getPromotion({ alias: promotionAlias })
        .then(data => {
          this.promotionData = data;
          this.hasPromotion = !isEmpty(data);
          if (this.hasPromotion) {
            this.promotionButtonInfo = {
              price: data.promotionPrice,
              userGroupAlias: data.promotionDetail.userGroupAlias,
              userStatus: data.userStatus,
              promotionType: data.promotionType,
            };

            if ((Date.now() > this.promotionData.startAt) &&
                (Date.now() < this.promotionData.endAt)) {
              this.isShowActivityBanner = true;
              const tagName = this.promotionData.promotionDetail.groupType ? '老带新' : '';
              this.activityBannerInfo = {
                tagName: `${tagName}${this.promotionData.promotionDetail.conditionNum}人团`,
                activityPrice: this.promotionData.promotionPrice,
                startAt: this.promotionData.startAt,
                endAt: this.promotionData.endAt,
                themeType: window._global.themeType,
              };
            }
          }
        })
        .catch(errMsg => {
          return [];
        });
    },
  },
};
