<template>
  <div class="referral-invite">
    <template v-if="isFetched">
      <template v-if="isOngoing">
        <h3 class="referral-invite__title">
          推荐有奖
        </h3>
        <p class="referral-invite__info-friend">
          邀请好友，好友下单享{{ referralInfo.newerSubsidyPrice }}元立减
        </p>
        <p class="referral-invite__info-self">
          您最高得
          <em class="tip">
            {{ referralInfo.commissionMoney }}元
          </em>现金奖励
        </p>
        <div class="referral-invite__img" />
        <div class="referral-invite__profit" @click="onToProfit">
          查看我的收益
          <van-icon name="arrow" />
        </div>
        <div class="referral-invite__btn" @click="onShowNormalPop">
          邀请好友
        </div>
        <div class="referral-invite__card" @click="onShowCardPop">
          或点击
          <span>获取图片邀请卡</span>
        </div>
      </template>

      <div v-else class="referral-invite__end">
        <div class="referral-invite__end-img" />
        <p class="referral-invite__end-tip">
          很遗憾，活动已结束
        </p>
        <div class="referral-invite__profit" @click="onToProfit">
          查看我的收益
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="referral-invite__rule" @click="onShowRulePop">
        查看奖励规则
      </div>
    </template>

    <van-popup
      v-model="show"
      class="referral-invite__pop"
      :close-on-click-overlay="false"
    >
      <rule-pop v-if="showRule" @closeRulePop="onCloseRulePop" />
      <share-card
        v-if="showCard && shareCardUrl"
        :share-card-url="shareCardUrl"
        @closeShareCard="onCloseCardPop"
      />
    </van-popup>

    <normal-share :show-normal="showNormal" @closeNormalShare="onCloseNormalPop" />
  </div>
</template>

<script>
import { Icon, Popup, Toast } from 'vant';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import { Canvas } from '@youzan/vis-ui';
import { getShareParamStr, appendLogParamsTo } from 'pct/utils';
// import * as canvasUtils from 'common/utils/canvas';
import { getPaidContentShareLink } from 'pct/utils/share';
import apis from 'pct/api';
import { getCommonWeappCode, getCommonSwanCode } from '../../../../common-api/utils';
import RulePop from './components/RulePop';
import ShareCard from './components/ShareCard';
import NormalShare from './components/NormalShare';
import { formatPrice } from '../../../edu/utils';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { forcePhoneLogin } from '@/common/utils/login';

const global = window._global;
const canvas = Canvas.coreDraw;
const canvasUtils = Canvas.utils;
const getTextEdge = (text, fontSize) => {
  const textLength = canvasUtils.measureContentLength(text, fontSize);
  const left = (375 - textLength) / 2;
  return {
    left,
    textLength,
  };
};

// 取用户头像宽度
const getUserBoxWidth = (a, b) => {
  const aLength = canvasUtils.measureContentLength(a, 13);
  const bLength = canvasUtils.measureContentLength(b, 13);
  const plus = 60;
  if (aLength < bLength) {
    return `${bLength + plus}px`;
  }
  return `${aLength + plus}px`;
};

export default {
  name: 'referral-invite',

  config: {
    title: '邀请好友参加',
  },

  components: {
    'van-icon': Icon,
    'van-popup': Popup,
    RulePop,
    ShareCard,
    NormalShare,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      friendDiscount: 10,
      selfAmount: 15,
      show: false,
      showRule: false,
      showCard: false,
      showNormal: false,
      drawInfos: {},
      shareUrl: '',
      referralInfo: {},
      shareCardUrl: '',
      isOngoing: false,
      isFetched: false,
      alias: this.$route.query.alias,
      mediaType: this.$route.query.mediaType || 0,
      title: this.$route.query.title || '',
      price: this.$route.query.price || 0,
      referralPrice: 0,
    };
  },

  created() {
    forcePhoneLogin((_, userId, doLogin) => {
      if (doLogin) {
        return window.location.reload();
      }
      // 检查用户头像等信息,如果没有，尝试获取1次
      const visBuyer = global.visBuyer || {};
      this.drawInfos.avatarSrc = visBuyer.finalAvatar;
      this.drawInfos.nickName = visBuyer.finalUsername;
      if (
        !this.drawInfos.avatarSrc &&
        !this.drawInfos.nickName &&
        !this.$route.query.wx_info
      ) {
        this.$route.query.wx_info = true;
        location.replace(
          getPaidContentShareLink(
            `${global.url.wap}/ump/paidcontent?kdt_id=${global.kdt_id}`,
            this.$route,
          )
        );
        return;
      }

      this.setShareConfig();

      this.getRefferalInfo();

      this.getAccountBussinessNumber();
    });
  },

  methods: {
    // 设置分享信息
    setShareConfig() {
      const { alias, mediaType } = this.$route.query;
      let params = '';
      if (+mediaType === 10) {
        // 课程商品
        params = getShareParamStr({
          kdt_id: global.kdt_id,
          bid: global.buyer_id,
          fid: global.fans_id,
          alias,
        });
        this.shareUrl = appendLogParamsTo(
          `${window.location.origin}/wscvis/edu/prod-detail?${params}`
        );
      } else {
        const type = +mediaType === 0 ? 'columnshow' : 'contentshow';
        const params = getShareParamStr({
          kdt_id: global.kdt_id,
          bid: global.buyer_id,
          fid: global.fans_id,
          alias,
          page: type,
        });

        this.shareUrl = appendLogParamsTo(
          `${window.location.origin}/wscvis/knowledge/index?${params}`
        );
      }

      setShareData({
        title:
          '您的好友在这里学习到了一门超赞的课程，快来一起参加学习，还有专属立减金额优惠哦。',
        desc: '点击链接，享受新客专属立减金额优惠',
        cover: 'https://b.yzcdn.cn/public_files/2018/09/10/share-icon.png',
        link: getShareLink(this.shareUrl),
      });
    },

    // 开通商户号
    getAccountBussinessNumber() {
      return apis.getAccountBussinessNumber({});
    },

    getRefferalInfo() {
      const { alias = '' } = this.$route.query;
      apis
        .getNewActivities({
          alias,
          productType: 31,
        })
        .then(data => {
          if (Array.isArray(data) && data.length) {
            data.forEach(item => {
              if (item.type === 'recommendPolite') {
                this.isOngoing = true;
                this.parseRefferalInfo(item.data[0]);
              }
            });
          }
          this.isFetched = true;
        })
        .then(() => {
          this.isOngoing && this.initDrawInfos();
        })
        .catch(err => {
          console.log('Error: ', err);
          this.isFetched = true;
        });
    },

    parseRefferalInfo(data = {}) {
      let referralPrice = 0;
      // 如果是课程商品
      if (data.isCourseUmp) {
        const referralPriceArray =
          data.recommendPoliteCourse.newerSubsidyPriceMap || {};
        const priceArrayTmp = [];
        for (const key in referralPriceArray) {
          priceArrayTmp.push(referralPriceArray[key]);
        }
        referralPrice = Math.min.apply(Math, priceArrayTmp);
        data.commissionMoney =
          data.recommendPoliteCourse.maxCommissionMoney || 0;
        data.newerSubsidyPrice =
          data.recommendPoliteCourse.maxNewerSubsidyPrice || 0;
      } else {
        referralPrice = this.price - data.newerSubsidyPrice;
      }
      data.commissionMoney = Number(data.commissionMoney / 100).toString().match(/(\d+(\.\d{1,2})?)(\d+)?/)[1];
      data.newerSubsidyPrice = Number(data.newerSubsidyPrice / 100).toString().match(/(\d+(\.\d{1,2})?)(\d+)?/)[1];
      this.referralPrice = referralPrice;
      this.referralInfo = data;
    },

    getQrcode() {
      const codeParam = {
        url: this.shareUrl,
        isShortenUrl: true,
      };

      const miniprogram = global.miniprogram || {};
      const { isWeapp, isSwanApp } = miniprogram;
      if (isWeapp) {
        // 生成小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(this.shareUrl),
        };
        return getCommonWeappCode(data);
      } else if (isSwanApp) {
        const data = {
          targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(this.shareUrl)}`,
        };
        return getCommonSwanCode(data);
      } else {
        return apis
          .getQrCode(codeParam)
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log('Error:', err);
            Toast('获取二维码出错');
          });
      }
    },

    // 生成cdn avatar
    getAvatar(avatarSrc) {
      return apis
        .postNetMaterial({
          fetchUrl: avatarSrc,
        })
        .then(res => {
          return res.url;
        });
    },

    onToProfit() {
      this.$router.push({
        name: 'Profit',
      });
    },

    onShowCardPop() {
      this.show = true;
      this.showCard = true;

      if (this.shareCardUrl) {
        return;
      }

      Toast('加载中...');
      this.initDrawInfos();
    },

    onCloseCardPop() {
      this.show = false;
      this.showCard = false;
    },

    onShowRulePop() {
      this.show = true;
      this.showRule = true;
    },

    onCloseRulePop() {
      this.show = false;
      this.showRule = false;
    },

    onShowNormalPop() {
      this.showNormal = true;
    },

    onCloseNormalPop() {
      this.showNormal = false;
    },

    initDrawInfos() {
      if (this.shareCardUrl) {
        return;
      }

      const drawInfos = {
        bgSrc: this.referralInfo.backGroundImageUrl,
        bgType: this.referralInfo.bgType || 0,
        // commissionMoney: numberFloor(this.refferalInfo.commissionMoney / 100),
        // newerSubsidyPrice: numberFloor(this.refferalInfo.newerSubsidyPrice / 100),
        commissionMoney: this.referralInfo.commissionMoney,
        title: this.title,
        price: `${formatPrice(this.price)}`,
        referralPrice: `￥${formatPrice(this.referralPrice)}`,
        newerSubsidyPrice: `￥${this.referralInfo.newerSubsidyPrice}`,
        avatarSrc:
          this.drawInfos.avatarSrc ||
          'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
        nickName: this.drawInfos.nickName || '小伙伴',
        qrcode: '',
      };

      Promise.all([this.getQrcode(), this.getAvatar(drawInfos.avatarSrc)]).then(
        ([qrcode, cdnAvatarSrc]) => {
          drawInfos.qrcode = qrcode;
          drawInfos.avatarSrc = cdnAvatarSrc;
          this.drawInviteCard(drawInfos);
        }
      );
    },

    drawInviteCard(drawInfos) {
      const currentPriceLength =
        getTextEdge('现价：', 14).textLength +
        getTextEdge(drawInfos.referralPrice, 20).textLength +
        getTextEdge('起', 10).textLength;
      const currentPriceLeft = (295 - currentPriceLength) / 2;
      const originPriceLeft =
        (295 - getTextEdge(`原价：￥${drawInfos.price}`, 13).textLength - getTextEdge('起', 8).textLength) / 2;
      const canvasConfig = {
        type: 'div',
        css: {
          width: '375px',
          height: '667px',
        },
        children: [
          // 背景图
          {
            type: 'image',
            css: {
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '375px',
              height: '667px',
            },
            url: drawInfos.bgSrc,
          },
          // 头像和昵称
          {
            type: 'div',
            css: {
              position: 'absolute',
              top: '20px',
              left: '20px',
              // width: '355px',
              width: getUserBoxWidth(`${drawInfos.nickName}帮你砍价成功`, '邀请你来加入'),
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#fff',
            },
            children: [
              {
                type: 'image',
                css: {
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                },
                url: drawInfos.avatarSrc || '',
              },
              {
                type: 'text',
                css: {
                  marginTop: '4px',
                  marginLeft: '45px',
                  fontSize: '13px',
                  height: '17px',
                  color: '#333',
                },
                text: `${drawInfos.nickName}帮你砍价成功`,
              },
              {
                type: 'text',
                css: {
                  marginTop: '0px',
                  marginLeft: '45px',
                  height: '17px',
                  fontSize: '13px',
                  color: '#333',
                },
                text: '邀你加入学习',
              },
            ],
          },
          {
            type: 'div',
            css: {
              position: 'absolute',
              top: '557px',
              left: '25px',
              width: '326px',
              height: '92px',
            },
            children: [
              {
                type: 'image',
                css: {
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: '326px',
                  height: '92px',
                },
                url: 'https://b.yzcdn.cn/public_files/2019/01/22/bottomBg.png',
              },
              {
                type: 'image',
                css: {
                  position: 'absolute',
                  top: '12px',
                  left: '17px',
                  width: '70px',
                  height: '70px',
                },
                url: drawInfos.qrcode || '',
              },
              {
                type: 'text',
                css: {
                  position: 'absolute',
                  top: '15px',
                  left: '93px',
                  width: '223px',
                  height: '20px',
                  fontSize: '15px',
                  color: '#000',
                },
                text: '好友送你一份优惠，买课最高减',
              },
              {
                type: 'text',
                css: {
                  position: 'absolute',
                  top: '35px',
                  left: '93px',
                  width: '223px',
                  height: '20px',
                  fontSize: '15px',
                  color: '#000',
                },
                text: `${drawInfos.newerSubsidyPrice}`,
              },
              {
                type: 'text',
                css: {
                  position: 'absolute',
                  top: '60px',
                  left: '93px',
                  width: '223px',
                  height: '18px',
                  fontSize: '13px',
                  color: '#999',
                },
                text: '长按识别二维码享受优惠立减',
              },
            ],
          },
          /* {
            type: 'div',
            css: {
              position: 'absolute',
              top: '573px',
              left: '20px',
              width: '335px',
            },
            children: [
              {
                type: 'image',
                css: {
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: '75px',
                  height: '75px',
                },
                url: drawInfos.qrcode || '',
              },
              {
                type: 'text',
                css: {
                  position: 'absolute',
                  top: '15px',
                  left: '87px',
                  width: '248px',
                  height: '22px',
                  fontSize: '16px',
                  color: '#000',
                },
                text: '好友送你一份优惠，买课最高减',
              },
              {
                type: 'text',
                css: {
                  position: 'absolute',
                  top: '15px',
                  left: `${87
                    + getTextEdge('好友送你一份优惠，买课最高减', 16).textLength}px`,
                  width: '248px',
                  height: '22px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#f60',
                },
                text: `${drawInfos.newerSubsidyPrice}`,
              },
              {
                type: 'text',
                css: {
                  position: 'absolute',
                  top: '40px',
                  left: '90px',
                  width: '248px',
                  height: '25px',
                  fontSize: '14px',
                  color: '#999',
                },
                text: '长按识别二维码享受优惠立减',
              },
            ],
          }, */
        ],
      };
      const titleAndPriceConfig = {
        // 标题和价格
        type: 'div',
        css: {
          position: 'absolute',
          top: '125px',
          left: '40px',
          width: '295px',
          height: '72px',
        },
        children: [
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '295px',
              height: '72px',
              lineHeight: '36px',
              lineClamp: 2,
              fontSize: '30px',
              color: '#000',
              textAlign: 'center',
            },
            text: drawInfos.title,
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '102px',
              left: `${originPriceLeft}px`,
              width: '295px',
              height: '18px',
              fontSize: '13px',
              color: '#666',
            },
            text: `原价：￥${drawInfos.price}`,
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '105px',
              left: `${originPriceLeft + getTextEdge(`原价：￥${drawInfos.price}`, 13).textLength + 2}px`,
              width: '295px',
              height: '10px',
              lineHeight: '10px',
              fontSize: '8px',
              color: '#666',
            },
            text: '起',
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '120px',
              left: `${currentPriceLeft}px`,
              width: '295px',
              height: '20px',
              lineHeight: '20px',
              fontSize: '14px',
              color: '#000',
            },
            text: `现价：`,
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '120px',
              left: `${currentPriceLeft + getTextEdge('现价：', 14).textLength}px`,
              width: '295px',
              height: '20px',
              lineHeight: '20px',
              fontSize: '20px',
              fontWeight: '600',
              color: '#000',
            },
            text: `${drawInfos.referralPrice}`,
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '128px',
              left: `${currentPriceLeft + getTextEdge('现价：', 14).textLength + getTextEdge(drawInfos.referralPrice, 20).textLength + 2}px`,
              width: '295px',
              height: '10px',
              lineHeight: '10px',
              fontSize: '10px',
              color: '#000',
            },
            text: '起',
          },
        ],
      };
      !drawInfos.bgType && canvasConfig.children.push(titleAndPriceConfig);
      canvas(canvasConfig).then(canvas => {
        this.shareCardUrl = canvas.toDataURL('image/png');
      });
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import "var";

.referral-invite {
  position: relative;
  min-height: 100vh;
  padding: 30px 20px;
  text-align: center;

  &__title {
    font-size: 34px;
    line-height: 48px;
    color: $c-black;
  }

  &__info {
    &-friend {
      margin-top: 10px;
      font-size: 18px;
      line-height: 25px;
      color: $c-black;
    }

    &-self {
      font-size: 26px;
      line-height: 37px;
      color: $c-black;

      .tip {
        color: $c-orange;
      }
    }
  }

  &__img {
    width: 100%;
    height: 216px;
    margin-top: 30px;
    background-image: url(https://b.yzcdn.cn/public_files/2018/08/22/invite-bg.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  &__profit {
    font-size: 14px;
    color: $c-gray-dark;

    .van-icon-arrow {
      font-size: 12px;
      vertical-align: bottom;
    }
  }

  &__btn {
    width: 100%;
    height: 45px;
    margin: 17px 0 12px;
    font-size: 16px;
    line-height: 45px;
    color: $c-white;
    background-color: $c-orange;
    border-radius: 2px;
  }

  &__card {
    font-size: 12px;
    color: $c-gray-dark;

    span {
      color: $c-orange;
    }
  }

  &__rule {
    position: absolute;
    bottom: 30px;
    left: 50%;
    width: 100%;
    max-width: 210px;
    margin: 60px auto;
    margin-left: -105px;
    font-size: 12px;
    color: $c-gray-dark;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAagAAAACAQMAAAA3jNq/AAAABlBMVEUAAADl5eX5J7raAAAAAXRSTlMAQObYZgAAABVJREFUCNdj+I8KPjBgA/xoqsjTBQAbcT3DZVIMuwAAAABJRU5ErkJggg==);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  &__pop {
    width: 100%;
    background-color: transparent;

    .rule-pop {
      margin: 0 40px;
    }

    .share-card {
      padding: 70px;
      margin: 0 auto;
    }
  }

  &__login {
    .header h2 {
      color: $c-gray-dark;
    }

    .van-button--primary {
      background-color: $c-orange;
      border-color: $c-orange;
    }
  }

  &__end {
    margin-top: 50%;

    &-img {
      width: 80px;
      height: 70px;
      margin: 0 auto;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACMCAMAAADMf1JSAAAAY1BMVEUAAADm5ubn5+f////m5ubz8/Pm5ubl5eXz8/P09PTz8/P09PT39/f////y8vLz8/Pz8/Py8vLz8/P29vb09PT4+Pj5+fn5+fn////l5eXy8vL////r6+v9/f35+fn09PT29vaA1UMPAAAAGXRSTlMA21MF8+KlivrL8rg6DvTv2timcGBJKigTxbpdswAAAslJREFUeNrs1cmOgzAQRVGGkEDIPFPEhv//ylZLUZfoIMXPLwwL32Wtjmy5HH3uWmb7XL5evs/Ka0S3KXIZsLzYULx7IYNX3P19Jxmlkydve5SROm59fLe1jNb6hvseiI8XPlBfmsmoZSkILGXkSnD9yehhCzGT0csQ30Um6AIADzJBB2BFyyS5r+uzTNLZGVjIJBVzfsPYO97JJO2cgblMUu4MlIkKwAAMwADsFoABGIAfCsAA/B4wTZbxovpLkBprjbG2/Tc0v+nUKRUs4mWSqi+JKw0DtqZ+ZWzPsDYIsauIk+jVSocoUCVKFFt3pg0I1Fbq8wM2pu5mdegjrHqFSfUW7lOhDnHhuySJojT2BipFs31D4w2MUz1AGGhr5ywM1CNcegONO9B4A5dR7Au0NVDrC4yjhS/QIEDrC1xE1ShAAwI1f2A9c2BTQ80dGK6YfsUEcN57kAA20A0TwHn/xQywMcQBcsCnONW6+hpx6tkPJIR2cJ8CeSHvA4C0kPcpkBQO6FMgL+R9GJAX8j4F8kLeBwN5Ie9TIC8cxqdAXkj5CCAhZH0KHETI+xQ4iJD3KXAAIeAjgIQQ8CFAXkj4ACAjJHwAkBESPgDICAEfAWSEP8zOMQ0AMBDEMCLhj7NjAKQnvRE4/ELQoQp/PSgmvx4Uk18PismvB8Xk14Ni8utBMfn1oJj8elBMfj0oJr8eFJNfD4rJrwfF5NeDYvLrQTH59aCY/HpQTH49KCa/HhTLn8GA4c9gwe5nMGH2M9iw+hmMGP0MVkx+PSgmP4Mdk5/BjsnPYMfkZ7Bj8jPYMfkZ7Jj8DHZMfgY7vv4MHvfauWMbAGIQCIIHtkwN9N/oJy9ZDsk2uKlgZSNCHOjAIQfiONCBQw7EcaADhxyIww/cjbYVjRY6jXaUjZZa6D+OJfYTpiRVY5WELiz9EjmHke+dBdTGvncWPiIiFjrKzWAqAAAAAElFTkSuQmCC);
      background-position: center;
      background-size: contain;
    }

    &-tip {
      margin: 20px 0;
      font-size: 18px;
      color: $c-gray-dark;
    }
  }
}
</style>
