import * as SafeLink from '@youzan/safe-link';
import { logClickMakePoster } from '../log';
import get from 'lodash/get';

const STATIC_ASSETS = {
  backgroundImage:
    'https://b.yzcdn.cn/public_files/2019/09/23/7a2d939a2116fe24fd451e9910c906fa.png',
  userAvatar:
    'https://b.yzcdn.cn/public_files/8c652f93e24858f0b4bd80d351279b51.png',
  errorIcon:
    'https://b.yzcdn.cn/public_files/2019/09/23/b0fbc7d61c18c0cf2a32d5abc70a23ef.png',
  wechatIcon:
    'https://img01.yzcdn.cn/public_files/2019/09/26/426f909d6f1642b0f9fd81638f075bfa.png',
  downloadIcon:
    'https://img01.yzcdn.cn/public_files/2019/09/26/51ca17583516bb20b8ad744f09172a5c.png',
  notExist: 'https://img01.yzcdn.cn/cdn/not-found.png',
};

const shareTypeOptions = [
  {
    value: 1,
    text: '分享给好友',
    onClick: function() {
      // this.$emit('logShare');
      // this.showShareActions = !this.showShareActions;
      this.showSharePopup = true;
    },
    popupTitle: '立即分享给好友吧',
    popupContent: '点击屏幕右上角将页面分享给好友',
  },
  {
    value: 2,
    text: '分享到朋友圈',
    onClick: function() {
      // this.$emit('logShare');
      // this.showShareActions = !this.showShareActions;
      this.showSharePopup = true;
    },
    popupTitle: '立即分享到朋友圈吧',
    popupContent: '点击屏幕右上角将页面分享到朋友圈',
  },
  {
    value: 3,
    text: '生成海报',
    onClick: function() {
      const feed = this.postDetail || {};
      logClickMakePoster({
        reviewedNum: get(feed, 'mentionedUsers', []).length,
        imageNum: get(feed, 'extraContents', []).length,
        videoNum: get(feed, 'extraContents', []).length,
        postId: get(feed, 'postId'),
        data: feed,
      });
      SafeLink.redirect({
        url: `/wscvis/edu/moments/poster?postId=${this.postDetail.postId}&kdt_id=${this.postDetail.kdtId}`,
        kdtId: this.postDetail.kdtId,
      });
    },
  },
  {
    value: 0,
    text: '取消',
    onClick: function() {},
  },
]; // 0: 取消, 1: 分享给好友, 2: 分享到朋友圈, 3: 生成海报

if ((_global.miniprogram || {}).isWeapp) {
  shareTypeOptions.splice(1, 1);
}

export default {
  STATIC_ASSETS,
  shareTypeOptions,
};
