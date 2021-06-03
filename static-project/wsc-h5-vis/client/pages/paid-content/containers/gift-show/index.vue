<template>
  <div class="container">
    <gift-header
      :text-info="textInfo"
      :count="contentData.num"
      :is-share-gift="isShareGift"
    />
    <gift-info-card
      :cover="contentData.cover"
      :title="contentData.title"
      :author="contentData.author"
      :is-column="isColumn"
      :avatar="contentData.userHeadPortrait"
      :user-name="contentData.userName"
      :media-type="contentData.mediaType"
      :video-duration="contentData.videoDuration"
      :audio-duration="contentData.audioDuration"
      :contents-count="contentData.contentsCount"
      :receiv-gift-status="contentData.shareStatus"
      :show-tip="isShowTip"
      :err-tip="errTip"
    />
    <div class="btn-wrap">
      <template v-if="!isShowTip">
        <van-button
          v-if="canSendGift"
          size="large"
          type="danger"
          @click="handleClick">
          {{ textInfo.btnText }}
        </van-button>
        <van-button
          v-else
          size="large"
          disabled
        >
          {{ textInfo.btnText }}
        </van-button>
      </template>
      <van-button
        v-else
        size="large"
        type="danger"
        @click="handleToHome"
      >
        查看其他课程
      </van-button>
      <p v-if="isShareGift" class="rank-desc">
        超过7天未被领取的礼物，将会自动原路退款至付款账户
      </p>
    </div>
    <rank-list
      v-if="isShowRankList"
      :list="contentData.list"
      :every-content-friend-count="contentData.num"
    />
    <share-guide
      v-show="showSharedFriend"
      @shareFriend="shareFriend"
    />
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import Args from 'zan-utils/url/args';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import apis from 'pct/api';
import GiftHeader from './components/GiftHeader';
import GiftInfoCard from './components/GiftInfoCard';
import RankList from './components/RankList';
import ShareGuide from './components/ShareGuide';
import { GIFT_TYPE, GIFT_TEXT_INFO, RECEIVE_GIFT_STATUS } from 'pct/constants';
import { appendLogParamsTo } from 'pct/utils';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { navigateEnv } from 'common/utils/env';
import buildUrl from '@youzan/utils/url/buildUrl';
import { TimingTask } from './utils/index';
import { checkAndLogin } from 'common/utils/login';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'gift-show',

  config: {
    title: '好友的赠礼',
  },

  components: {
    GiftHeader,
    GiftInfoCard,
    RankList,
    ShareGuide,
    'van-button': Button,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      contentData: {},
      showSharedFriend: false,
      alias: '',
      isShowTip: false,
      errTip: '',
    };
  },

  computed: {
    giftType() {
      return parseInt(Args.get('gift_type'), 10);
    },
    orderAlias() {
      return Args.get('order_alias');
    },
    shareAlias() {
      return Args.get('share_alias');
    },
    channelType() {
      return Args.get('channel_type');
    },
    giftNo() {
      return Args.get('gift_no');
    },
    giftSign() {
      return Args.get('gift_sign');
    },
    receiveGiftType() {
      const list = this.contentData.list || [];
      const isCurrentUser = list.some(item => item.isCurrentUser);
      if (this.contentData.shareStatus === 2 && !isCurrentUser) { // 特殊处理
        return 7;
      }
      return this.contentData.shareStatus;
    },
    isShareGift() {
      return this.giftType === GIFT_TYPE.SHARE_GIFT;
    },
    textInfo() {
      return GIFT_TEXT_INFO[this.isShareGift ? 'SHARE_GIFT' : this.receiveGiftType] || {};
    },
    isColumn() {
      return this.contentData.owlType === 1;
    },
    canSendGift() {
      if (this.isShareGift) {
        return this.contentData.canSendGift === 1;
      }
      return true;
    },
    isShowRankList() {
      return get(this.contentData, 'list.length', 0);
    },
  },

  created() {
    checkAndLogin(() => {
      this.getGiftDeatailInfo();
    });
  },

  methods: {
    getGiftDeatailInfo() {
      this.alias = this.$route.query.alias;
      if (this.giftType === GIFT_TYPE.SHARE_GIFT) {
        document.title = '我要送礼';
        const timingTask = new TimingTask(3000);
        timingTask.start(() => {
          this.getShareGift({
            order_alias: this.orderAlias,
          }).then(() => {
            timingTask.stop();
          }).catch(() => {
            timingTask.stop();
          });
        }).catch(() => { // 超时捕获
          Toast('订单还未支付，暂不能领取');
        });
      } else if (this.giftType === GIFT_TYPE.RECEIVE_GIFT) {
        const receiveParam = this.getReceiveParam();
        this.getReceiveGift(receiveParam).then(data => {
          this.contentData = data;
          this.setShareParam({
            giftNo: this.giftNo,
            giftSign: this.giftSign,
          });
        });
      }
    },

    handleClick() {
      if (this.isShareGift) {
        this.shareFriend();
      } else if (this.receiveGiftType === RECEIVE_GIFT_STATUS.UNRECEIVE) {
        const receiveParam = this.getReceiveParam();
        this.getReceiveGift(receiveParam).then(data => {
          const shareStatus = data.shareStatus;
          if (shareStatus === RECEIVE_GIFT_STATUS.UNRECEIVE) {
            // this.jumpToContent(shareStatus);
            this.getReceiveGiftResult(receiveParam);
          } else {
            this.contentData = data;
          }
        });
      } else {
        this.jumpToContent();
      }
    },

    getReceiveGiftResult(params) {
      return new Promise((resolve) => {
        apis.getReceiveGiftResult(params).then(data => {
          const receiveResult = data;
          if (receiveResult.shareStatus === RECEIVE_GIFT_STATUS.RECEIVED) {
            Toast('领取成功，跳转中...');
            this.jumpToContent(receiveResult);
          } else {
            Toast('礼物领取失败了，再领一次吧');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        })
          .catch((err) => {
            Toast(err);
          });
      });
    },

    getReceiveParam() {
      return {
        alias: this.alias,
        share_alias: this.shareAlias,
        channel_type: this.channelType,
        order_alias: this.orderAlias,
        gift_no: this.giftNo,
        gift_sign: this.giftSign,
      };
    },

    jumpToContent(receiveResult) {
      // 跳转到详情页面
      let url;
      const type = this.isColumn ? 'columnshow' : 'contentshow';
      if (receiveResult && receiveResult.shareStatus === RECEIVE_GIFT_STATUS.RECEIVED) {
        const urlParamsStr = this.getShareParamStr({
          is_receive: 1,
          kdt_id: window._global.kdt_id,
          share_alias: this.shareAlias,
          channel_type: this.channelType,
          order_alias: this.orderAlias,
          gift_no: this.giftNo,
          gift_sign: this.giftSign,
          p: type,
          alias: this.alias,
        });
        url = buildUrl(`/wscvis/knowledge/index?${urlParamsStr}#/${type}?alias=${this.alias}`, '', this.kdtId);
      } else {
        url = buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=${type}&alias=${this.alias}`, '', this.kdtId);
      }
      SafeLink.redirect({
        url,
        kdtId: window._global.kdt_id,
      });
    },

    shareFriend() {
      this.showSharedFriend = !this.showSharedFriend;
    },

    // 分享礼物详情
    getShareGift(params) {
      return new Promise((resolve, reject) => {
        apis.getSendGiftInfo(params)
          .then((res) => {
            const { code = 0, data = {} } = res;
            if (code !== 0) {
              this.isShowTip = true;
              if (code === 348200013) {
                this.errTip = '课程商品被删除了，具体原因请咨询商家';
              }
            } else {
              this.contentData = data;
              this.setShareParam({
                giftNo: this.contentData.giftNo,
                giftSign: this.contentData.giftSign,
              });
            }
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 领取礼物详情
    getReceiveGift(params) {
      return new Promise((resolve, reject) => {
        apis.getReceiveGiftInfo(params).then((res) => {
          const { code = 0, data = {} } = res;
          if (code !== 0) {
            this.isShowTip = true;
            if (code === 348200013) {
              // 商品被删除
              this.errTip = '课程商品被删除了，具体原因请咨询商家';
            }
          }
          resolve(data);
        }).catch(e => {
          console.error('获取礼物领取详情失败');
        });
      });
    },
    // 设置好友来收礼分享内容
    setShareParam({ giftNo, giftSign }) {
      const userName = this.contentData.userName || '匿名用户';
      const paramStr = this.getShareParamStr({
        kdt_id: window._global.kdt_id,
        channel_type: this.channelType,
        order_alias: this.orderAlias,
        share_alias: this.shareAlias,
        gift_no: giftNo,
        gift_sign: giftSign,
        gift_type: 2,
        page: 'giftshow',
        alias: this.alias,
      });
      const shareUrl = appendLogParamsTo(`${window._global.url.wap}/ump/paidcontent?${paramStr}`);
      // 修改分享内容
      setShareData({
        notShare: false,
        desc: `作者：${this.contentData.author} | ${this.contentData.title}`,
        link: getShareLink(shareUrl),
        title: `${userName}买了份礼物送给你，快来领取吧`,
        cover: this.contentData.cover,
        weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
      });
    },
    // 获取分享url参数
    getShareParamStr(params) {
      let paramStr = '';
      forEach(params, (val, key) => {
        paramStr += `&${key}=${val}`;
      });
      return paramStr.substring(1);
    },

    handleToHome() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'var';

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 603px;
  background-size: 100%;
  background-image: url(/public_files/2018/05/09/917e3026d6f59864ba15df28dc67ef5c.png);
}

.btn-wrap {
  width: 81%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rank-desc {
  font-size: 12px;
  margin-top: 15px;
  color: #999;
}
</style>
