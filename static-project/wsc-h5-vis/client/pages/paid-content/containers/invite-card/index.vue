<template>
  <div class="invite-img">
    <div class="invite-img__preview">
      <div class="invite-img__image">
        <img :src="genImageList[currentBgIndex] || bgList[currentBgIndex].poster">
      </div>
      <p class="invite-img__hint">
        长按上方图片保存并发送到朋友圈
      </p>
    </div>

    <div class="invite-img__action-area">
      <image-picker
        :image-list="bgIconList"
        @change="onChangeImage"
      >
        <div
          v-show="isDistribution"
          class="invite-img__notice"
          @click="onClickNotice"
        >
          <i />
          <span>分享须知</span>
        </div>
      </image-picker>
    </div>

    <div
      v-if="toggleShareBtn"
      class="invite-img__float-area"
      @click="onClickOtherShare"
    >
      <img src="https://b.yzcdn.cn/paidcontent/sharecard/linkIcon.png">
    </div>

    <login
      :show-login="showLogin"
      :allow-close="false"
    />

    <van-actionsheet
      v-model="showOtherShare"
      title="其他分享方式"
    >
      <other-share-intro
        :link="shortShareUrl || shareUrl"
        @close="showOtherShare = !showOtherShare"
      />
    </van-actionsheet>
  </div>
</template>

<script>
import { Toast, ActionSheet } from 'vant';
import ImagePicker from './components/ImagePicker';
import Login from '../../components/Login';
import constants from './constants';
// import { draw } from './drawImg';
import { Canvas } from '@youzan/vis-ui';
import { uploadNetMaterial, invoke, appendLogParamsTo } from 'pct/utils';
import { getPaidContentShareLink } from 'pct/utils/share';
import apis from 'pct/api';
import { getCommonWeappCode } from '../../../../common-api/utils';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import OtherShareIntro from './components/OtherShareIntro';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import getPosterConfig from './config/poster.config';
import getDynamicConfig from './config/dynamic.config';
import * as SafeLink from '@youzan/safe-link';
const { BGLIST, BGICONLIST, DISTRIBUTORSTATUS } = constants;

const global = window._global;
const canvas = Canvas.coreDraw;

export default {
  name: 'invite-card',

  config: {
    title: '分享邀请好友',
    hideCopyright: true,
  },

  components: {
    ImagePicker,
    Login,
    OtherShareIntro,
    'van-actionsheet': ActionSheet,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      bgList: BGLIST,
      // bgIconList: BGICONLIST,
      dynamicPosterLength: 0, // 自定义海报
      bgIconList: BGICONLIST,
      currentBgIndex: 0,
      genImageList: [],
      showLogin: false,
      drawInfos: {},
      shareUrl: appendLogParamsTo(`${global.url.wap}/ump/paidcontent?${this.$route.query.qrurl}`),
      discount: +this.$route.query.discount || 0,
      isDistribution: JSON.parse(this.$route.query.isDistribution) || false, // 因为这里拿到的字符串'true'或'false'，所以要JSON.parse一下
      showOtherShare: false,
      // 复制用短链
      shortShareUrl: '',
      distributorStatus: false,
      // 其它分享方式按钮显隐状态
      toggleShareBtn: false,
    };
  },

  created() {
    // 不带有qrurl或alias的话，直接重定向回店铺首页
    if (!this.$route.query.qrurl || !this.$route.query.alias) {
      SafeLink.redirect({
        url: `${global.url.wap}/showcase/homepage?kdt_id=${global.kdt_id}`,
        kdtId: global.kdt_id,
      });
      return;
    }
    // 商品参与分销，需要获取用户登录态
    if (this.isDistribution && !global.buyer_id) {
      this.showLogin = true;
      return;
    }

    // 检查用户头像等信息,如果没有，尝试获取1次
    const visBuyer = global.visBuyer || {};
    this.drawInfos.avatarSrc = visBuyer.finalAvatar;
    this.drawInfos.user = visBuyer.finalUsername;
    if (!this.drawInfos.avatarSrc && !this.drawInfos.user && !this.$route.query.wx_info) {
      this.$route.query.wx_info = true;
      location.replace(getPaidContentShareLink(`${global.url.wap}/ump/paidcontent?kdt_id=${global.kdt_id}`, this.$route));
      return;
    }

    this.getPosters()
      .then(this.initDrawInfos);
  },

  methods: {
    /**
       * 检测分销员状态
       */
    checkDistributorStatus() {
      return apis.postDistributor({})
        .then(({ status }) => {
          this.noticeUser(status);
          this.distributorStatus = status;
          return this.getQrCode(this.distributorStatus === DISTRIBUTORSTATUS.pass);
        });
    },

    // 获取海报背景图
    getPosters() {
      const alias = this.$route.query.alias;
      return apis.getFindRelatedImgApi({ alias })
        .then(posters => {
          const userDefinedPosters = [];
          (posters || []).forEach(item => {
            userDefinedPosters.push({ type: 'dynamic', poster: item });
          });
          this.dynamicPosterLength = userDefinedPosters.length || 0;
          this.bgList = userDefinedPosters.concat(BGLIST);
          this.bgIconList = userDefinedPosters.concat(BGICONLIST);
          return userDefinedPosters.concat(BGLIST);
        })
        .catch(() => {
          this.bgList = BGLIST;
          this.bgIconList = BGICONLIST;
          return BGLIST;
        });
    },

    /**
       * 初始化绘制
       */
    initDrawInfos() {
      Toast('正在初始化数据...');
      const drawInfos = Object.assign({
        bgSrc: this.bgList[this.currentBgIndex].poster,
        type: this.bgList[this.currentBgIndex].type,
        qrSrc: '',
        avatarSrc: '',
        title: this.$route.query.title || '',
        teacher: this.$route.query.author || '',
        shareImg: decodeURIComponent(this.$route.query.shareImg || ''),
        user: '',
        color: this.bgList[this.currentBgIndex].color || '',
      }, this.drawInfos);

      // 设置默认值
      drawInfos.avatarSrc = drawInfos.avatarSrc || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
      drawInfos.user = drawInfos.user || '小伙伴';

      return this.fetchAvatar(drawInfos);
    },

    /**
       * 获取头像部分
       */
    fetchAvatar(drawInfos) {
      this.getAvatar(drawInfos.avatarSrc)
        .then(cdnAvatarSrc => {
          drawInfos.avatarSrc = cdnAvatarSrc;
          return this.isDistribution
            ? this.checkDistributorStatus()
            : this.getQrCode();
        })
        .then(qrCode => {
          this.toggleShareBtn = true;
          this.setQRCode(drawInfos, qrCode);
        })
        .catch((err) => {
          console.warn(err);
          Toast('初始化分享失败，请刷新重试');
        });
    },

    /**
       * 设置二维码
       */
    setQRCode(drawInfos, qrCode) {
      drawInfos.qrSrc = qrCode;
      this.drawInfos = drawInfos;
      // this.setShareConfig(drawInfos);

      this.genImage();
    },

    // 根据分销员状态给用户一些提示
    noticeUser(distributorStatus) {
      switch (distributorStatus) {
        case DISTRIBUTORSTATUS.pass:
          return;
        case DISTRIBUTORSTATUS.unpass:
          this.$dialog.alert({
            message: '您没有通过商家分销员审核，在此期间你可以把课程分享给好友但无法获得邀请佣金',
            confirmButtonText: '我知道了',
          });
          return;
        case DISTRIBUTORSTATUS.checking:
          this.$dialog.alert({
            message: '商家需要审核您的申请，在此期间你可以把课程分享给好友但无法获得邀请佣金',
            confirmButtonText: '我知道了',
          });
          break;
        case DISTRIBUTORSTATUS.error:
          // return this.$dialog.alert({
          //   message: '分销员状态获取失败，在此期间你可以把课程分享给好友但无法获得邀请佣金',
          //   confirmButtonText: '我知道了'
          // });
          break;
        default:
      }
    },
    // 切换模板
    onChangeImage(index) {
      this.currentBgIndex = index;
      this.genImage(index);
    },

    getQrCode(isDistributor = false) {
      if (!isDistributor) {
        return this.getWrapQrCode(this.shareUrl);
      }

      const salesManParam = {
        kdt_id: global.kdt_id,
        buyer_id: global.buyer_id,
        type: 'paidcontent',
        redirect: this.shareUrl,
        alias: this.$route.query.alias,
      };
      return apis.getShareData(salesManParam)
        .then(res => {
          if (res.recommendUrl) {
            this.shareUrl = res.recommendUrl;
            return this.getWrapQrCode(this.shareUrl);
          }

          // fix bug: 如果获取不到分销推荐连接，走非分销途径生成二维码
          if (this.isDistribution) Toast('获取分销链接失败，将通过普通链接分享');
          return this.getWrapQrCode(this.shareUrl);
        });
    },

    // 根据环境来判断生成小程序码还是二维码
    getWrapQrCode(realUrl) {
      const miniprogram = global.miniprogram || {};
      const isWeapp = miniprogram.isWeapp;
      if (isWeapp) {
        // 生成小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(realUrl),
        };
        return getCommonWeappCode(data);
      } else {
        return apis.getQrCode({ url: realUrl, isShortenUrl: true });
      }
    },

    // 生成cdn avatar
    getAvatar(avatarSrc) {
      return invoke(uploadNetMaterial, avatarSrc)
        .then(res => {
          return res.url;
        });
    },
    // 绘图
    genImage(index = 0) {
      if (this.genImageList[index]) return;
      Toast('加载中...');
      this.drawInfos = Object.assign({}, this.drawInfos, {
        bgSrc: this.bgList[this.currentBgIndex].poster,
        type: this.bgList[this.currentBgIndex].type,
        color: this.bgList[this.currentBgIndex].color || '',
        index,
      });

      const config = this.drawInfos.type === 'dynamic'
        ? getDynamicConfig(this.drawInfos)
        : getPosterConfig(this.drawInfos, this.dynamicPosterLength);

      if (!this.drawInfos.qrSrc) { // 如果没有二维码，直接拦截canvas绘图逻辑
        Toast('生成二维码失败，请刷新重试');
        return;
      }
      canvas(config).then((canvas) => {
        const canvasImg = canvas.toDataURL('image/jpeg', 0.8);

        this.$set(this.genImageList, index, canvasImg);
        Toast.clear();
      })
        .catch((err) => {
          console.warn(err.msg);
          Toast.clear();
          Toast('生成图片失败，请刷新重试');
        });
    },
    onClickNotice() {
      this.$dialog.alert({
        message: `每成功邀请1位好友购买成功，将获得￥${(this.discount / 100).toFixed(2)}作为奖励。`,
        confirmButtonText: '我知道了',
      });
    },
    onClickOtherShare() {
      this.showOtherShare = true;
      if (!this.shortShareUrl) {
        apis.getShortUrl({
          url: this.shareUrl,
        })
          .then(data => {
            this.shortShareUrl = data.shorten_url;
          })
          .catch(err => {
            console.warn('[getShortUrl]', err);
          });
      }
    },
    setShareConfig(drawInfos) {
      const shareConfig = {
        notShare: false,
        link: getShareLink(this.shareUrl),
        desc: '一起来看吧',
        title: drawInfos.title,
      };
      if (drawInfos.shareImg) {
        shareConfig.cover = drawInfos.shareImg;
      }
      setShareData(shareConfig);
    },
  },
};
</script>

<style lang="scss">
  .invite-img {
    display: flex;
    height: 100vh;
    background: #e5e5e5;
    flex-direction: column;

    &__preview {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &__hint {
      margin-top: 18px;
      font-size: 13px;
      color: #333;
    }

    &__image {
      img {
        width: 60vw;
      }
    }

    &__notice {
      text-align: center;

      span {
        font-size: 12px;
        color: #787878;
      }

      i {
        display: inline-block;
        width: 11px;
        height: 11px;
        margin-left: 5px;
        vertical-align: middle;
        background-image: url(https://b.yzcdn.cn/paidcontent/sharecard/noticeIcon.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    &__float-area {
      position: fixed;
      right: 0;
      bottom: 120px;

      img {
        width: 52px;
        height: 40px;
      }
    }
  }

  .pc-mode {
    .invite-img {
      height: 667px;
    }
  }
</style>
