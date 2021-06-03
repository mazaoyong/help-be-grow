<template>
  <div class="invite-img">
    <div class="invite-img__preview">
      <div class="invite-img__image">
        <img :src="genImageList[currentBgIndex] || bgList[currentBgIndex].poster">
      </div>
      <p class="invite-img__hint">
        长按上方图片保存并发送微信好友
      </p>
    </div>

    <div class="invite-img__action-area">
      <image-picker
        :image-list="bgIconList"
        @change="onChangeImage"
      />
    </div>
    <template v-if="entry !== 'normal'">
      <salesman-icon-app
        :goods-id="goodsId"
        :calculated-hire-fee="+discount"
        :share-url="shareUrl"
        :share-title="title"
        :get-share-opportunity="'show'"
        :custom-top="isDistributor ? {} : {title: '课程分享方式', description: ''}"
        :page-type="isDistributor ? 'edu-goods' : 'edu-link-share'"
        :hide-bottom="!isDistributor"
        :need-set-share="false"
      >
        <div
          v-if="isToggleShareBtn && !isMiniProgram"
          slot="icon"
          class="invite-img__float-area"
        >
          <img src="https://b.yzcdn.cn/public_files/f9a4528191fcaca072f1bda9bfb2c3cf.png">
        </div>
      </salesman-icon-app>
    </template>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { format } from 'date-fns';
import Args from 'zan-utils/url/args';
import ImagePicker from './components/ImagePicker';
import constants from './constants';
import { Canvas } from '@youzan/vis-ui';
import { uploadNetMaterial, invoke } from '../../paid-content/utils';
import API from '../../paid-content/api';
import { setShareData } from '@youzan/wxsdk';
import getPosterConfig from './config/poster.config';
import getDynamicConfig from './config/dynamic.config';
import { getCommonWeappCode, getCommonSwanCode } from '../../../common-api/utils';
import { formatPrice } from '../../edu/utils';
import { VALID_PERIOD_TYPE, COURSE_SELL_TYPE, VALID_PERIOD_DESC, COURSE_EFFECTIVE_DESC, COURSE_TYPE } from '../../edu/constant';
import { SalesmanIconApp } from '@/shared/components/salesman-icon';
import api from './api';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import cdnDowngrade from '@/common/utils/cdn-downgrade';
import { checkCapitalLossForInviteShareUrl } from '@/common/log/biz-log';

const { BGLIST, BGICONLIST, DISTRIBUTORSTATUS } = constants;

const global = window._global;
const canvas = Canvas.coreDraw;

const miniprogram = global.miniprogram || {};
const { isMiniProgram, isWeapp, isSwanApp } = miniprogram;

const inviteData = global.inviteData || {};
// const salesmanInfo = global.salesmanInfo;
const distributorStatus = global.distributorStatus;
const isDistributor = distributorStatus === DISTRIBUTORSTATUS.pass;

let globalShareUrl = global.shareUrl;

const defautAvatar = 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';

export default {
  name: 'invite-card',

  components: {
    ImagePicker,
    [SalesmanIconApp.name]: SalesmanIconApp,
  },

  data() {
    const umpType = Args.get('ump_type');
    const umpAlias = Args.get('ump_alias');
    if (umpType) {
      globalShareUrl = `${globalShareUrl}&ump_type=${umpType}&ump_alias=${umpAlias}`;
    }
    return {
      goodsId: '',
      bgList: BGLIST,
      // bgIconList: BGICONLIST,
      bgIconList: BGICONLIST,
      dynamicPosterLength: 0, // 自定义海报
      currentBgIndex: 0,
      genImageList: [],
      drawInfos: {},
      alias: Args.get('alias') || '',
      price: '',
      time: '',
      author: '',
      title: '',
      summary: '', // 分享描述
      shareUrl: CustomSafeLink.getSafeUrl({ url: globalShareUrl }),
      shareImg: '',
      discount: inviteData.distributionMoney || 0,
      isDistribution: inviteData.isDistribution,
      showOtherShare: false,
      // 复制用短链
      shortShareUrl: '',
      // 商品分销状态
      distributorStatus: distributorStatus,
      // 用户分销员状态
      isDistributor: isDistributor,
      // 其它分享方式按钮显隐状态
      isToggleShareBtn: false,
      owlType: Number(Args.get('owlType')),
      isMiniProgram,
      entry: Args.get('entry') || '',
    };
  },

  created() {
    // 不带有alias的话，直接重定向回店铺首页
    if (!this.alias) {
      CustomSafeLink.redirect({
        url: `${global.url.wap}/showcase/homepage?kdt_id=${global.kdt_id}`,
        kdtId: window._global.kdt_id,
      });
      return;
    }

    // 检查用户头像等信息,如果没有，尝试获取1次
    const visBuyer = global.visBuyer || {};
    this.drawInfos.avatarSrc = visBuyer.finalAvatar;
    this.drawInfos.user = visBuyer.finalUsername;
    Promise.all([
      this.fetchProduct(),
    ])
      .then(this.initDrawInfos);
  },

  methods: {
    // 获取商品信息
    fetchProduct() {
      const alias = this.alias;
      return api.getDistributorDetail({ alias })
        .then(content => {
          const distributorPics = content.distributorPics || [];
          if (this.owlType === 10) {
            // 处理线下课
            const { offlineCourse = {} } = content;
            const {
              minPrice = 0,
              maxPrice = 0,
              goodsId,
              pictures,
              title,
              subTitle,
            } = offlineCourse;
            if (minPrice === maxPrice) {
              this.price = `￥${formatPrice(minPrice)}`;
            } else {
              this.price = `￥${formatPrice(minPrice)}起`;
            }
            this.title = title;
            this.shareImg = pictures[0];
            this.summary = subTitle;
            this.handleCourseTime(offlineCourse);
            this.goodsId = goodsId;
          } else {
            // 处理线上课
            const { onlineCourse = {} } = content;
            const {
              price = 0,
              author = 0,
              goodsId,
              cover,
              title,
              summary,
            } = onlineCourse;
            this.price = `￥${formatPrice(price)}`;
            this.title = title;
            this.shareImg = cover;
            this.author = author;
            this.summary = summary;
            this.goodsId = goodsId;
          }
          // 处理分销员海报背景图
          const userDefinedPosters = [];
          (distributorPics || []).forEach(item => {
            userDefinedPosters.push({ type: 'dynamic', poster: item });
          });
          this.dynamicPosterLength = userDefinedPosters.length || 0;
          this.bgList = userDefinedPosters.concat(BGLIST);
          this.bgIconList = userDefinedPosters.concat(BGICONLIST);
          this.setShareData();
        });
    },

    // 处理课程时间
    handleCourseTime(data = {}) {
      //  如果不需要展示时间，则使 this.courseTime = '';
      const {
        validityPeriodUnit,
        validityPeriodType,
        validityPeriodRange,
        courseEffectiveDelayDays,
        courseSellType,
        courseEffectiveType,
        courseType,
        courseStartAt: startAt,
        courseEndAt: endAt,
      } = data;

      // 生效时间描述
      const validStartDesc =
        COURSE_EFFECTIVE_DESC[courseEffectiveType] &&
        COURSE_EFFECTIVE_DESC[courseEffectiveType](courseEffectiveDelayDays);
      // 有效期描述
      const validPeriodDesc =
        VALID_PERIOD_DESC[validityPeriodType] &&
        VALID_PERIOD_DESC[validityPeriodType](validityPeriodRange, validityPeriodUnit);

      if (courseType === COURSE_TYPE.CASUAL || courseSellType === COURSE_SELL_TYPE.DIY) {
        if (startAt && endAt) {
          if (startAt === endAt) {
            this.time = format(startAt, 'YYYY.MM.DD');
          } else {
            this.time = `${format(startAt, 'YYYY.MM.DD')}-${format(endAt, 'YYYY.MM.DD')}`;
          }
          return;
        }
        if (startAt) {
          this.time = `${format(startAt, 'YYYY.MM.DD')}`;
        }
      } else if (validityPeriodType === VALID_PERIOD_TYPE.FOREVER && courseSellType !== COURSE_SELL_TYPE.DURATION) {
        return (this.time = '');
      } else if (courseSellType === COURSE_SELL_TYPE.COUNT) {
        return (this.time = `${validStartDesc},${validPeriodDesc}`);
      } else if (courseSellType === COURSE_SELL_TYPE.DURATION) {
        return (this.time = validStartDesc);
      } else if (courseSellType === COURSE_SELL_TYPE.SESSION) {
        return (this.time = '');
      }
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
        title: this.title || '',
        teacher: this.author || '',
        user: '',
        color: this.bgList[this.currentBgIndex].color || '',
        owlType: this.owlType,
      }, this.drawInfos);

      // 设置默认值
      drawInfos.avatarSrc = drawInfos.avatarSrc || defautAvatar;
      drawInfos.user = drawInfos.user || '小伙伴';

      return this.fetchAvatar(drawInfos);
    },

    /**
       * 获取头像部分
       */
    fetchAvatar(drawInfos) {
      this.getAvatar(drawInfos.avatarSrc)
        .then(cdnAvatarSrc => {
          if (typeof cdnAvatarSrc === 'string') {
            cdnAvatarSrc = cdnAvatarSrc.replace(/^http:/, 'https:');
          }
          drawInfos.avatarSrc = cdnAvatarSrc || defautAvatar;
          this.isDistribution && this.noticeUser(this.distributorStatus);
          return this.getQrCode();
        })
        .then(qrCode => {
          this.isToggleShareBtn = true;
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
          break;
        case DISTRIBUTORSTATUS.unpass:
          this.$dialog.alert({
            message: '您没有通过商家分销员审核，在此期间你可以把课程分享给好友但无法获得邀请佣金',
            confirmButtonText: '我知道了',
          });
          break;
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
          break;
      }
    },

    // 切换模板
    async onChangeImage(index) {
      this.currentBgIndex = index;
      /** 切换模板的时候需要更新分享的URL链接来更新海报id */
      await this.getQrCode();
      await this.$nextTick();
      this.genImage(index);
    },

    getQrCode(isDistributor = false) {
      if (isWeapp) { // 生成微信小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(this.shareUrl),
        };
        return getCommonWeappCode(data);
      } else if (isSwanApp) { // 生成百度小程序码
        const data = {
          targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(this.shareUrl)}`,
        };
        return getCommonSwanCode(data);
      } else {
        // 如果是商家自定义的海报，来源的值标记为DYNAMIC
        const originValue = this.dynamicPosterLength > 0 && this.currentBgIndex >= this.dynamicPosterLength
          ? this.currentBgIndex - this.dynamicPosterLength : 'DYNAMIC';
        const shareURLWithPosterIdx = Args.add(this.shareUrl, { edu: `INVITE_CARD::${originValue}` });
        return API.getQrCode({ url: shareURLWithPosterIdx, isShortenUrl: true }, true);
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
        bgSrc: cdnDowngrade(this.bgList[this.currentBgIndex].poster),
        type: this.bgList[this.currentBgIndex].type,
        color: this.bgList[this.currentBgIndex].color || '',
        price: this.price,
        time: this.time,
        shareImg: cdnDowngrade(this.shareImg),
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

    setShareData() {
      const shareConfig = {
        link: this.shareUrl,
        desc: this.summary || '一起来看吧',
        title: this.title,
        cover: this.shareImg,
      };
      setShareData(shareConfig);

      checkCapitalLossForInviteShareUrl({ url: this.shareUrl });
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
