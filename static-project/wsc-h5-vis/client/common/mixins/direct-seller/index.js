import { Toast } from 'vant';
import { getShareLink, setShareData } from '@youzan/wxsdk';
import fullfillImage from 'zan-utils/fullfillImage';
import Args from 'zan-utils/url/args';
import Api from './api';

const getPaidContentShareLink = (link) => {
  const params = {
    is_share: 1,
  };
  // 针对微信认证需要处理对应的分享链接
  return getShareLink(Args.add(link, params));
};

export default {
  data() {
    return {
      showDirectSeller: false,
      directSellerInfo: {},
      shareIcon: '',
    };
  },

  methods: {
    getDirectSellerData() {
      const data = {
        'kdt_id': window._global.kdt_id,
        'buyer_id': window._global.buyer_id,
        type: 'paidcontent',
        redirect: getPaidContentShareLink(window.location.href),
        title: document.title,
      };

      // 如果是详情页，参数添加alias
      data.alias = Args.get('alias') || '';

      let showDirectSeller;
      // 先获取是否是店铺分销员
      Api.getShareData(data).then(res => {
        if (res.code === 0) {
          if (res.data.isShowButton) {
            const data = res.data;
            showDirectSeller = data.isShowButton;
            this.shareIcon = data.shareIcon || fullfillImage('public_files/2017/7/18/2bcf631430ab9320109c2a85fdffd679.png');
            // 更新分享信息
            setShareData({
              link: getShareLink(data.recommendUrl),
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
            return Api.getSellerData(info);
          }
        } else {
          throw new Error(res.msg);
        }
      }).then(res => {
        if (res.code === 0) {
          // 获取弹出层中信息
          this.directSellerInfo = res.data;
        }
      }).catch(err => {
        if (typeof err === 'string') {
          Toast(err);
        }
      });
    },
  },

  created() {
    this.getDirectSellerData();
  },
};
