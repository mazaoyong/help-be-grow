<template>
  <div class="group-detail">
    <div class="group-detail__devide">
      <div class="group-detail__devide-line" />
    </div>
    <div class="group-detail__text">
      <p
        v-if="newGroupText"
        class="group-detail__text-up"
      >
        {{ newGroupText }}
      </p>
      <div class="group-detail__text-center">
        <!-- 团进行中时，需要拼接显示 -->
        <p
          v-if="groupLoaded && groupData.group.status===0 && productDetail.status === 1"
          class="group-detail__text-center-going"
        >
          <span>还差</span>
          <span class="num">
            {{ groupData.group.remainJoinNum }}
          </span>
          <span>人，组队最高立省</span>
          <span class="unit">
            ￥
          </span>
          <span class="num">
            {{ discountPrice }}
          </span>
        </p>
        <p
          v-else
          class="group-detail__text-center-other"
        >
          {{ mainText }}
        </p>
        <p
          v-if="smallText"
          class="group-detail__text-center-down"
        >
          {{ smallText }}
        </p>
      </div>
    </div>

    <div
      v-if="isShowCountdown"
      class="group-detail__countdown"
    >
      <count-down
        :end-at="Date.now() + groupData.group.remainTime"
        :time-separator="['天', '时', '分', '秒']"
      />
    </div>

    <div class="group-detail__button">
      <van-button
        v-for="(item, index) in buttonInfo"
        :key="index"
        :class="[index === 1 ? 'text-btn' : 'main-btn']"
        round
        @click="onClickEvent(item.type)"
      >
        <span class="text">
          {{ item.text }}
        </span>
        <template v-if="item.price">
          <span>￥</span>
          <span class="price">
            {{ item.price }}
          </span>
        </template>
      </van-button>
    </div>

    <van-popup
      v-model="showShare"
      :class="['group-detail__pop', showGuide ? 'guide-pop': '' ]"
      @click-overlay="closeCard"
    >
      <div
        v-if="showCard && shareCardUrl"
        class="group-detail__pop-card"
      >
        <em
          class="group-detail__pop-card-close"
          @click="closeCard"
        />
        <img
          :src="shareCardUrl"
          alt=""
        >
      </div>

      <div
        v-if="showGuide"
        class="group-detail__pop-guide"
      >
        <div class="group-detail__pop-guide-image" />
        <p class="group-detail__pop-guide-text">
          快戳右上角，分享给好友
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Button, Dialog, Popup, Toast, Loading } from 'vant';
import { get } from 'lodash';
// import accSub from 'zan-utils/number/accSub';
import { USER_JOIN_GROUP_STATUS, GROUP_STATUS, ACTIVITY_STATUS, GROUP_TYPE, USER_IDENTITY } from '../constants';
import CountDown from '../../components/CountDown';
import { formatPrice } from '../../utils';
import '../../prod-detail/event-bus';
import { getQrCode } from '../../../../common-api/qr-code';
import { uploadNetMaterial, getImageWidth } from 'pct/utils';
import * as canvasUtils from 'common/utils/canvas';
import API from '../../api';
import { getCommonWeappCode } from '../../../../common-api/utils';
import { navigateEnv } from '../../../../common/utils/env';
import * as SafeLink from '@youzan/safe-link';

const kdtId = window._global.kdt_id;
const url = window._global.url;
const headerTagUrl = 'https://b.yzcdn.cn/public_files/2019/01/02/header.png';
const bannerBg = 'https://b.yzcdn.cn/public_files/2019/01/02/bannerBg.png';
const visBuyer = window._global.visBuyer || {};

export default {
  name: 'group-detail',

  components: {
    [Button.name]: Button,
    [CountDown.name]: CountDown,
    [Popup.name]: Popup,
    [Loading.name]: Loading,
  },

  props: {
    groupLoaded: {
      type: Boolean,
      default: false,
    },

    groupData: {
      type: Object,
      default: () => {},
    },

    productDetail: {
      type: Object,
      default: () => {},
    },

    shareUrl: {
      type: String,
      default: '',
    },

    courseTag: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      mainText: '',
      newGroupText: '',
      smallText: '',
      buttonInfo: [],
      isShowCountdown: false,
      discountPrice: 0,
      shareCardUrl: '',
      showCard: false,
      showGuide: false,
      showShare: false,
    };
  },

  mounted() {
    this.formatData();
    this.formatShareScuccess();
  },

  methods: {
    formatShareScuccess() {
      window.__onShareAppMessage = () => {
        this.showShareCard();
      };

      window.__onShareTimeline = () => {
        this.showShareCard();
      };

      window.__onShareQQ = () => {
        this.showShareCard();
      };

      window.__onShareQZone = () => {
        this.showShareCard();
      };
    },
    formatData() {
      // 拼团主文案
      let mainText = '';
      // 上个团已满，新开团时的文案
      let newGroupText = '';
      // 团成功或失败时金额提示文案
      let smallText = '';
      // 按钮信息
      const buttonInfo = [];
      // 是否显示倒计时
      let isShowCountdown = false;

      if (this.groupLoaded) {
        // 库存
        const stock = get(this.productDetail.skuFormatModel, 'stockNum', 0);
        // 活动状态
        const activityStatus = this.groupData.groupon.status;
        // 团状态
        const groupStatus = this.groupData.group.status;
        // 用户是否参加了当前团
        const userStatus = this.groupData.userGroupStatus.status;
        // 还差几人成团
        const remainJoinNum = this.groupData.group.remainJoinNum;
        // 入口为上一个团，支付后是否为新开团
        const userJoinFromGroupId = this.groupData.userGroupStatus.fromGroupId;
        // 用户所在团的团id
        const groupId = this.groupData.userGroupStatus.groupId;
        // 节省金额
        // const discountPrice = accSub(this.productDetail.skuFormatModel.minPrice, this.groupData.groupon.minPrice);
        this.discountPrice = formatPrice(this.groupData.groupon.maxSavePrice || 0);
        const groupPrice = formatPrice(this.groupData.groupon.minPrice);
        const originPrice = formatPrice(this.productDetail.skuFormatModel.minPrice);
        if (userStatus === USER_JOIN_GROUP_STATUS.JOINED) {
          // 用户参与了当前团
          if (groupStatus === GROUP_STATUS.SUCCESS) {
            // 团成功
            mainText = '拼团成功，祝你学习愉快';
            buttonInfo.push({ text: '查看课程', type: 'success' });
          } else if (stock === 0) {
            // 团未成功,且商品已售罄
            mainText = '该课程已售罄，去看看其他课程吧';
            buttonInfo.push({ text: '进店逛逛', type: 'home' });
          } else {
            // 团未成功,且商品未售罄
            if (activityStatus === ACTIVITY_STATUS.END) {
              // 活动已结束
              mainText = '拼团失败，已退款';
              smallText = '支付欠款将在1-15个工作日原路返还至你的账户';
              buttonInfo.push({ text: `直接购买:`, type: '0', price: originPrice });
            } else if (activityStatus === ACTIVITY_STATUS.ONGOING) {
              // 活动进行中
              if (groupStatus === GROUP_STATUS.ONGOING) {
                // 团进行中
                mainText = `还差${remainJoinNum}人，组队最高立省${this.discountPrice}`;
                if (userJoinFromGroupId > 0 && userJoinFromGroupId !== groupId) {
                  newGroupText = '上个团已满，你已被选为新团长';
                }
                buttonInfo.push(
                  { text: '邀请好友参团', type: 'share' },
                  { text: '生成分享海报', type: 'card' }
                );
                isShowCountdown = true;
                this.initDrawInfos();
              } else {
                // 团失效
                mainText = '拼团失败，已退款';
                smallText = '支付欠款将在1-15个工作日原路返还至你的账户';
                buttonInfo.push(
                  { text: '开个新团:', type: '1', price: groupPrice },
                  { text: '直接购买', type: '0' }
                );
              }
            }
          }
        } else if (userStatus === USER_JOIN_GROUP_STATUS.NOT_JOIN) {
          // 用户未参与当前团
          if (stock === 0) {
            // 商品已售罄
            mainText = '课程已售罄，去看看其他课程吧';
            buttonInfo.push({ text: '进店逛逛', type: 'home' });
          } else {
            if (activityStatus === ACTIVITY_STATUS.END) {
              // 活动已结束
              mainText = '拼团活动已结束';
              buttonInfo.push({ text: '直接购买:', type: '0', price: originPrice });
            } else if (activityStatus === ACTIVITY_STATUS.ONGOING) {
              // 活动进行中
              if (groupStatus === GROUP_STATUS.ONGOING) {
                // 团进行中
                mainText = `还差${remainJoinNum}人，组队最高立省${this.discountPrice}`;
                isShowCountdown = true;
                buttonInfo.push(
                  { text: '我要参团:', type: '1', price: groupPrice },
                  { text: '直接购买', type: '0' }
                );
              } else {
                mainText = groupStatus === GROUP_STATUS.SUCCESS ? '此团已满员，去开个新团吧！' : '此团已失效，去开个新团吧！';
                smallText = `组队最高立省￥${this.discountPrice}`;
                buttonInfo.push(
                  { text: '开个新团:', type: '1', price: groupPrice },
                  { text: '直接购买', type: '0' }
                );
              }
            }
          }
        }
      } else {
        mainText = '哎呀，晚了一步，课程卖完了';
        smallText = '订单已关闭并自动退款';
        buttonInfo.push({ text: '进店逛逛', type: 'home' });
      }
      console.log('buttonInfo', buttonInfo);
      this.mainText = mainText;
      this.newGroupText = newGroupText;
      this.smallText = smallText;
      this.buttonInfo = buttonInfo;
      this.isShowCountdown = isShowCountdown;
    },

    onClickEvent(type) {
      switch (type) {
        case 'home':
          this.toHome();
          break;
        case 'success':
          SafeLink.redirect({
            url: `${url.h5}/wscvis/knowledge/index?page=mypay&kdt_id=${kdtId}#/mypay`,
            kdtId,
          });
          break;
        case 'card':
          this.showShareCard();
          break;
        case 'share':
          this.showShareGuide();
          break;
        // type：0->直接购买，1->拼团
        case '0':
        case '1':
          this.startPay(+type);
          break;
      }
    },

    showShareGuide() {
      this.showCard = false;
      this.showShare = true;
      this.showGuide = true;
    },

    showShareCard() {
      if (!this.shareCardUrl) {
        Toast('绘制中...');
        this.initDrawInfos();
      }
      this.showGuide = false;
      this.showCard = true;
      this.showShare = true;
    },

    initDrawInfos() {
      const drawInfos = {
        picture: this.productDetail.pictures[0].url,
        title: this.productDetail.title,
        courseTag: this.courseTag,
        groupPrice: `${formatPrice(this.groupData.groupon.price)}`,
        price: `￥${formatPrice(this.productDetail.skuFormatModel.minPrice)}`,
        isHead: this.groupData.userGroupStatus.isHead,
        conditionNum: this.groupData.groupon.conditionNum,
        avatar: visBuyer.finalAvatar,
        nickName: visBuyer.finalUsername,
        qrcode: '',
      };

      Promise.all([
        this.getQrcode(),
        this.getAvatar(drawInfos.avatar),
      ])
        .then(([qrcode, cdnAvatarSrc]) => {
          drawInfos.qrcode = qrcode;
          drawInfos.avatar = cdnAvatarSrc;
          this.drawCard(drawInfos);
        })
        .then(() => {
          Toast.clear();
        });
    },

    getQrcode() {
      const miniprogram = window._global.miniprogram || {};
      const isWeapp = miniprogram.isWeapp;
      if (isWeapp) {
        // 生成小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(this.shareUrl),
        };
        return getCommonWeappCode(data)
          .then(res => {
            return res;
          })
          .catch(err => {
            console.log('Error:', err);
            Toast('获取小程序码出错，请稍后重试');
          });
      } else {
        const codeParam = {
          url: this.shareUrl,
          isShortenUrl: true,
        };
        return getQrCode(codeParam)
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.log('Error:', err);
            Toast('获取二维码出错');
          });
      }
    },

    getAvatar(avatarSrc) {
      return uploadNetMaterial(avatarSrc)
        .then((res = {}) => {
          return res.data.url;
        });
    },

    drawCard(drawInfos) {
      if (this.shareCardUrl) {
        return;
      }
      Promise.all([
        canvasUtils.loadUrlImage(drawInfos.picture),
        canvasUtils.loadUrlImage(drawInfos.avatar),
        canvasUtils.loadBase64Image(drawInfos.qrcode),
        canvasUtils.loadUrlImage(headerTagUrl),
        canvasUtils.loadUrlImage(bannerBg),
      ])
        .then(([pic, avatar, qrcode, headerTag, bannerBg]) => {
          // 创建canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const ratio = canvasUtils.getScreenRatio(ctx);
          canvas.width = 375 * ratio;
          canvas.height = 667 * ratio;
          canvas.style.width = 375 + 'px';
          canvas.style.height = 667 + 'px';
          canvas.style.letterSpacing = 25 + 'px';
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

          // 绘制背景
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, 375, 667);

          // 绘制头像
          canvasUtils.drawImage(ctx, avatar, 20, 22, 40, 40, 20);
          drawInfos.isHead && canvasUtils.drawImage(ctx, headerTag, 46, 22, 28, 16, 8);

          // 绘制用户名
          canvasUtils.drawTextLine(ctx, drawInfos.nickName, 77, 36, 13, null, '#666', 18);
          canvasUtils.drawTextLine(ctx, '邀请你一起组队学习！', 77, 54, 13, null, '#666', 18);

          // 绘制主图背景
          ctx.save();
          canvasUtils.drawImage(ctx, bannerBg, 10, 68, 355, 320);
          ctx.clip();
          ctx.restore();

          // 绘制主图背景
          const bannerImgWidth = getImageWidth(pic, 320, 169);
          const bannerX = bannerImgWidth.width > 300 ? 300 : bannerImgWidth.width;
          canvasUtils.drawImage(
            ctx,
            pic,
            (375 - bannerX) / 2,
            (169 - bannerImgWidth.height) / 2 + 86,
            bannerX,
            bannerImgWidth.height
          );

          // 绘制标题
          const titleLength = canvasUtils.measureContentLength(ctx, drawInfos.title, 18, 'PingFang SC');
          const line = titleLength / 320;
          const letterWidth = Math.floor(320 / 18);
          const titleArr = [];
          if (line > 1) {
            titleArr.push(drawInfos.title.slice(0, letterWidth));
            titleArr.push(drawInfos.title.slice(letterWidth, 2 * letterWidth));
          } else {
            titleArr.push(drawInfos.title);
          }

          titleArr.forEach((item, index) => {
            const textY = 287 + index * 22;
            canvasUtils.drawTextLine(ctx, item, 38, textY, 18, 'PingFang SC', '#111', '', 22, '500', 300);
          });

          // 绘制标签
          let drawTags = [];
          let tagLength = 0;
          let offsetX = 38;
          if (drawInfos.courseTag.length > 3) {
            drawTags = drawInfos.courseTag.slice(0, 3);
          } else {
            drawTags = drawInfos.courseTag;
          }

          drawTags.length && drawTags.forEach((item, index) => {
            tagLength = Math.ceil(canvasUtils.measureContentLength(ctx, item.tag, 12, 'PingFang SC'));
            canvasUtils.drawTextLine(ctx, item.tag, offsetX + 4, 338, 12, 'PingFang SC', '#6d6d6d', '', 10);
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#e6e6e6';
            this.drawRoundRect(ctx, offsetX, 325, tagLength + 8, 20, 2);
            ctx.stroke();
            offsetX += tagLength + 12;
            if (index === 2) {
              canvasUtils.drawTextLine(ctx, '...', offsetX, 338, 12, 'PingFang SC', '#6d6d6d', '', 10);
            }
          });

          // 绘制直线
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#f2f2f2';
          ctx.moveTo(20, 483);
          ctx.lineTo(355, 483);
          ctx.stroke();

          // 绘制价格
          canvasUtils.drawTextLine(ctx, `${drawInfos.conditionNum}人团：`, 20, 536, 18, 'PingFang SC', '#333', 24);
          const groupTagLength = `${drawInfos.conditionNum}人团：`.length * 18;
          console.log('groupTagLength', groupTagLength);
          canvasUtils.drawTextLine(ctx, '￥', (groupTagLength), 536, 18, 'PingFang SC', '#333', 24);
          canvasUtils.drawTextLine(ctx, drawInfos.groupPrice, (groupTagLength + 18), 536, 32, 'PingFang SC', '#333', 38);
          canvasUtils.drawTextLine(ctx, `价格：${drawInfos.price}`, 20, 561, 15, null, '#999', 20);

          // 绘制二维码文字
          canvasUtils.drawTextLine(ctx, '长按右侧二维码参与拼团', 20, 620, 15, null, '#999', 16);

          // 绘制二维码
          canvasUtils.drawImage(ctx, qrcode, 225, 497, 130, 130, 0);

          return canvas.toDataURL('image/png');
        })
        .then((canvasImg) => {
          this.shareCardUrl = canvasImg;
          Toast.clear();
        })
        .catch((err) => {
          console.warn(err);
          Toast.clear();
          Toast('生成图片失败，请过会再试');
          this.closeCard();
        });
    },

    drawRoundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    },

    closeCard() {
      this.showShare = false;
      this.showCard = false;
      this.showGuide = false;
    },

    startPay(type) {
      const purchaseLimit = this.productDetail.purchaseLimit || false;
      const grouponLimit = this.groupData.userGroupStatus.isUserLimit || false;
      const groupType = this.groupData.groupon.groupType;
      const userIdentity = this.groupData.userIdentity;
      const groupStatus = this.groupData.group.status;

      // 判断限购逻辑
      let limitNum = 0;
      if (purchaseLimit) {
        limitNum = this.productDetail.quota;
      } else {
        if (type === 1 && grouponLimit) {
          limitNum = this.groupData.groupon.goodsLimit;
        }
      }

      // 判断售罄逻辑
      this.checkIsSellout()
        .then((isSellout) => {
          let msg = '';
          if (!isSellout) {
            if (purchaseLimit || (!purchaseLimit && type === 1 && grouponLimit)) {
              msg = `该课程限购${limitNum}次/人，不能再买了`;
              this.showDialog(msg);
            } else {
              if (type === 1 &&
                groupType === GROUP_TYPE.NEW &&
                userIdentity === USER_IDENTITY.OLD &&
                groupStatus === GROUP_STATUS.ONGOING
              ) {
                this.showNewDialog();
              } else {
                this.$bus.$emit('toPay', type);
              }
            }
          } else {
            msg = '该课程已售罄，去看看其他课程吧';
            this.showDialog(msg);
          }
        });
    },

    // 判断商品是否售罄
    checkIsSellout() {
      const alias = this.productDetail.alias;
      return new Promise((resolve) => {
        API.getProductStockApi({ alias })
          .then((res = {}) => {
            if (res.code === 0) {
              const data = res.data || {};
              const stockNum = data.stockNum;
              resolve(stockNum <= 0);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    },

    showNewDialog() {
      Dialog.confirm({
        message: '你是我们的老客户了,可以去开个新团立享优惠',
        confirmButtonText: '开新团',
        cancelButtonText: '算了',
        className: 'group-detail__dialog',
      }).then(() => {
        // 点击确认后的事件
        this.$bus.$emit('toPay', 1);
      }).catch(() => {

      });
    },

    showDialog(msg) {
      Dialog.confirm({
        message: msg,
        confirmButtonText: '进店逛逛',
        className: 'group-detail__dialog',
      }).then(() => {
        // 点击确认后的事件
        this.toHome();
      }).catch(() => {

      });
    },

    toHome() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
@import "var";
@import 'mixins/index.scss';

.group-detail {
  position: relative;
  padding: 25px 35px;
  margin-top: -1px;
  text-align: center;
  background-color: $c-white;
  border-radius: 6px;

  &__devide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;

    &-line {
      height: 1px;
      margin: 0 20px;
      background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
      background-repeat: repeat-x;
      background-size: 8px 1px;
    }

    &::before {
      position: absolute;
      top: -8px;
      left: -1px;
      width: 8px;
      height: 16px;
      background-color: #bdbfc4;
      border-radius: 0 16px 16px 0;
      content: '';
    }

    &::after {
      position: absolute;
      top: -8px;
      right: -1px;
      width: 8px;
      height: 16px;
      background-color: #babcc1;
      border-radius: 16px 0 0 16px;
      content: '';
    }
  }

  &__text {
    margin-bottom: 18px;

    &-up {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 18px;
      color: $c-gray-darker;
    }

    &-center {
      font-size: 18px;
      font-weight: 400;
      line-height: 22px;
      color: $c-black;

      &-going {
        .num {
          padding: 0 1px;
          font-size: 28px;
          font-weight: 600;
          line-height: 28px;
          vertical-align: middle;
        }

        .unit {
          font-weight: 600;
        }
      }

      &-other {
        margin-top: 20px;
      }

      &-down {
        margin-top: 10px;
        font-size: 14px;
        line-height: 18px;
        color: $c-gray-darker;
      }
    }
  }

  &__countdown {
    .countdown-container {
      .cap-countdown {
        &__day,
        &__hour,
        &__minute,
        &__second {
          padding: 1px 4px;
          font-size: 20px;
          line-height: 28px;
          color: $c-black !important;
          vertical-align: middle;
          background-color: #f2f2f2 !important;
        }

        &__time-text {
          margin: 0 5px;
          font-size: 14px;
          color: $c-gray-darker;
        }
      }
    }
  }

  &__button {
    margin-top: 40px;

    .van-button--round {
      display: block;
      width: 100%;
      border: none;

      &::after {
        border: none !important;
      }

      &.main-btn {
        .price {
          font-size: 22px;
        }
      }

      &.text-btn {
        width: auto;
        height: initial;
        margin: 0 auto;
        margin-top: 15px;
        font-size: 13px;
        line-height: initial;
        color: $c-gray-darker;
      }
    }
  }

  &__dialog {
    .van-dialog {
      &__message {
        font-size: 16px;
        color: $c-black;
        text-align: center;
      }

      &__confirm {
        color: #0c0;
      }
    }
  }

  &__pop {
    background-color: transparent !important;

    &.guide-pop {
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
      transform: none;
    }

    &-card {
      position: relative;
      min-width: 300px;

      &-close {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        width: 33px;
        height: 35px;
        background-image: url(https://img01.yzcdn.cn/punch/image/close-rounded@2x.png);
        background-repeat: no-repeat;
        background-size: contain;
      }

      img {
        width: 100%;
        border-radius: 10px;
      }
    }

    &-guide {
      &-image {
        height: 230px;
        margin-top: 20px;
        margin-right: 20px;
        background-image: url(/public_files/2018/04/08/share-guide-book@2x.png);
        background-position: right;
        background-repeat: no-repeat;
        background-size: contain;
      }

      &-text {
        margin-top: 30px;
        font-size: 14px;
        color: $c-white;
        text-align: center;
      }
    }
  }
}
</style>
