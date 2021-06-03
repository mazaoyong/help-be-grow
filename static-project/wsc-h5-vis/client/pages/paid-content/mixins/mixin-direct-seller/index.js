import { setShareData, getShareLink } from '@youzan/wxsdk';
import fullfillImage from 'zan-utils/fullfillImage';
import apis from 'pct/api';
import { getPaidContentShareLink } from 'pct/utils/share';
import DirectSeller from './DirectSeller';
import { appendLogParamsTo } from 'pct/utils';

export default {
  name: 'mixinSeller',

  components: {
    DirectSeller,
  },

  data() {
    return {
      showDirectSeller: false,
      directSellerInfo: {},
      shareIcon: '',
    };
  },

  methods: {
    getDirectSellerData(title) {
      const data = {
        'kdt_id': window._global.kdt_id,
        'buyer_id': window._global.buyer_id,
        type: 'paidcontent',
        redirect: getPaidContentShareLink(window.location.href, this.$route),
        title: title,
      };

      // 如果是详情页，参数添加alias
      if (this.$route.query.alias) {
        data.alias = this.$route.query.alias;
      };

      let showDirectSeller;
      // 先获取是否是店铺分销员
      apis.getShareData(data)
        .then(data => {
          if (data.isShowButton) {
            // const data = data;
            showDirectSeller = data.isShowButton;
            this.shareIcon = data.shareIcon || fullfillImage('public_files/2017/7/18/2bcf631430ab9320109c2a85fdffd679.png');
            // 更新分享信息
            setShareData({
              link: getShareLink(appendLogParamsTo(data.recommendUrl)),
              title: data.recommendText,
            });
            this.showDirectSeller = showDirectSeller;
            const info = {
              /* eslint-disable */
              kdt_id: window._global.kdt_id,
              goods_id: data.goodsId || null,
              recommend_url: data.recommendUrl,
              recommend_text: data.recommendText
              /* eslint-enable */
            };
            // 再获取点击赚后要显示的弹层中用到的相关数据
            return apis.getSellerData(info);
          }
        })
        .then(data => {
          // 获取弹出层中信息
          this.directSellerInfo = data;
        })
        .catch(errMsg => {
          // Toast(errMsg);
        });
    },
  },

  created() {
    // const meta = this.$route.meta;
    // if (!meta.showDirectSeller) return;
    // 有分销员权限，且需要展示
    if (document.title) {
      this.getDirectSellerData(document.title);
    }
  },
};
