<template>
  <div class="paid-content__seller">
    <div class="fixed-icon ds-btn">
      <div class="js-ds-spread" @click="spreadClick">
        <img :src="shareIcon" width="50">
      </div>
    </div>
    <van-popup
      v-model="showContent"
      position="bottom"
      :lock-on-scroll="true"
    >
      <div class="directseller-popup">
        <div class="directseller-popup__cancel-icon" @click="closePop" />
        <div v-if="isGoods && goodsPrice && hirePrice" class="directseller-popup__title">
          分享后预计最高可赚取佣金 ￥{{ hirePrice }}
        </div>
        <div v-else class="directseller-popup__title">
          立即分享给好友
        </div>

        <div class="directseller-popup__desc">
          朋友通过你分享的页面成功购买后，你可获得对应的佣金。佣金可在“会员中心-{{ directSellerInfo.salesman_name || '分销员' }}中心”里查看
        </div>
        <div class="directseller-popup__icon-list clearfix">
          <ul>
            <li
              v-for="(item, key) in iconMap"
              :key="key"
              class="directseller-popup__icon-wrap"
              :class="item.jsHook"
            >
              <span class="directseller-popup__icon">
                <img :src="item.iconSrc">
                <span class="directseller-popup__icon-desc">
                  {{ item.iconDesc }}
                </span>
              </span>
            </li>
          </ul>
        </div>
        <div class="directseller-popup__button">
          <a :href="salesmanCenterUrl">
            我的{{ directSellerInfo.salesman_name || '分销员' }}中心
          </a>
        </div>
      </div>
    </van-popup>
    <share-mask
      :show-share-w-x="showShareWX"
      :show-qr="showQr"
      :show-img-qr="showImgQr"
      :is-goods="isGoods"
      :qr-url="qrUrl"
      :simpleimg-qr-url="simpleimgQrUrl"
      :img-qr-url="imgQrUrl"
      :show-copy="showCopy"
      :copy-text="copyText"
      @close-mask="closeMask"
    />
  </div>
</template>

<script>
import { Popup, Toast } from 'vant';
import { DIRECT_SELLER_ICON_MAP } from 'pct/constants';
import Clipboard from 'clipboard';
import DirectSellerMask from './DirectSellerMask';
import canvasUtils from './directSellerCanvasUtils.js';
const global = window._global;
const salesmanWapUrl = global.url.wap.slice(0, -2) + 'salesman';
export default {
  name: 'direct-seller',

  components: {
    'van-popup': Popup,
    'share-mask': DirectSellerMask,
  },

  props: {
    directSellerInfo: Object,
    shareIcon: String,
    goodsPrice: Number,
  },

  data() {
    const isGoods = !(location.hash === '#/allcontents' || location.hash === '#/allcolumns');
    return {
      showContent: false,
      iconMap: DIRECT_SELLER_ICON_MAP,
      salesmanCenterUrl: `${salesmanWapUrl}/home/center?kdt_id=${global.kdt_id}`,
      showShareWX: false,
      showQr: false,
      showImgQr: false,
      showCopy: false,
      qrUrl: '',
      isGoods: isGoods,
      simpleimgQrUrl: '',
      imgQrUrl: '',
      copyText: '',
    };
  },

  computed: {
    hirePrice() {
      if (this.goodsPrice) {
        return this.handlePrice(this.goodsPrice * this.directSellerInfo.goods_cps_rate / 1000000);
      } else {
        return 0;
      }
    },
  },

  methods: {
    spreadClick(e) {
      this.showContent = true;
      this.$nextTick(() => {
        this.bindEvents();
      });
    },

    shareWX() {
      this.showContent = false;
      this.showShareWX = true;
    },

    copyUrl() {
      const recommendText = this.directSellerInfo.recommend;
      if (Clipboard.isSupported()) {
        const clipboard = new Clipboard('.js-copy', {
          text() {
            return recommendText;
          },
        });

        clipboard.on('success', () => {
          Toast.clear();
          Toast({
            message: '复制成功',
          });
          this.showContent = false;
        });
      } else {
        this.showContent = false;
        this.showCopy = true;
        this.copyText = recommendText;
      }
    },

    shareQr() {
      this.showContent = false;
      this.showQr = true;
      canvasUtils.generateQr(this.directSellerInfo.qr_url).then(qrUrl => {
        this.qrUrl = qrUrl;
      }).catch(() => {
        Toast('生成图片出错');
      });
    },

    shareImgQr() {
      this.showContent = false;
      this.showImgQr = true;
      if (!this.isGoods) {
        canvasUtils.generateSimpleImgQr(this.directSellerInfo.qr_url).then(qrUrl => {
          this.simpleimgQrUrl = qrUrl;
        }).catch(() => {
          Toast('生成图片出错');
        });
      } else {
        const shareData = window.getShareData && window.getShareData();
        if (!shareData) {
          Toast('生成图片出错');
          return;
        }
        // 商品页面
        canvasUtils.generateImgQr(
          shareData.imgUrl,
          this.directSellerInfo.qr_url,
          this.goodsPrice / 100,
          shareData.title.slice(4),
          global.mp_data.logo
        ).then(qrUrl => {
          this.imgQrUrl = qrUrl;
        }).catch(() => {
          Toast('生成图片出错');
        });
      }
    },

    bindEvents() {
      document.querySelector('.js-wechat').addEventListener('click', () => {
        this.shareWX();
      });
      document.querySelector('.js-copy').addEventListener('click', () => {
        this.copyUrl();
      });
      document.querySelector('.js-qrcode').addEventListener('click', () => {
        this.shareQr();
      });
      document.querySelector('.js-img-qrcode').addEventListener('click', () => {
        this.shareImgQr();
      });
    },

    closeMask() {
      // 不管是什么情况下触发，一律全部置为false
      this.showShareWX = this.showQr = this.showImgQr = this.showCopy = false;
    },

    closePop() {
      this.showContent = false;
    },

    handlePrice(goodsPrice) {
      // 价格小于0.01 不计算，大于0.01 取两位小数
      if (goodsPrice >= 0.01) {
        const arr = ('' + goodsPrice).split('.');
        if (arr[1]) {
          // 取两位小数
          arr[1] = arr[1].slice(0, 2);
          return arr.join('.');
        } else {
          return goodsPrice;
        }
      } else {
        return 0;
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import 'var';

$sprite-sale_new-position: -250px -50px;
$sprite-sale-position: -250px -100px;

.paid-content {
  &__seller {
    .fixed-icon {
      position: fixed;
      right: 6px;
      bottom: 52px;
      z-index: 70;
      width: 50px;
      height: 50px;
      cursor: pointer;
      border-radius: 26px;
    }

    .ds-btn {
      bottom: 115px;

      .icon-img {
        height: 100%;
        background-image: url(https://img01.yzcdn.cn/v2/image/wap/right_icon/icons_sprite/icons_sprite_e4444b6200.png);
        background-position: $sprite-sale-position;
        background-repeat: no-repeat;
        background-size: 300px 150px;

        @include retina {
          background-image: url(https://img01.yzcdn.cn/v2/image/wap/right_icon/icons_sprite/icons_sprite@2x_6b9819545.png);
        }
      }
    }
  }
}

.directseller-popup {
  &__cancel-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 44px;
    height: 44px;
    background-image: url(https://img01.yzcdn.cn/public_files/2017/09/12/d4659853b43fcc9c4d16254f605187a9.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 22px 22px;
  }

  &__title {
    width: 250px;
    margin: 0 auto;
    margin-top: 30px;
    font-size: 16px;
    line-height: 22px;
    color: #333;
    text-align: center;
  }

  &__desc {
    width: 297px;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: .4px;
    color: #999;
    text-align: center;
  }

  &__icon-list {
    width: 297px;
    margin: 0 auto;
    margin-top: 20px;

    ul {
      height: 78px;
    }
  }

  &__icon-wrap {
    float: left;
    width: 54px;
    height: 78px;
    margin-right: 26px;

    img {
      width: 54px;
      height: 54px;
    }

    &:last-child {
      margin-right: 0;

      .directseller-popup__icon-desc {
        width: 60px;
      }
    }
  }

  &__icon {
    display: block;
    width: 54px;
    height: 54px;
  }

  &__icon-desc {
    display: block;
    width: 54px;
    height: 12px;
    margin-top: 10px;
    font-size: 12px;
    color: #999;
    text-align: center;
  }

  &__button {
    position: relative;
    width: 95%;
    height: 44px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 44px;
    color: #333;
    text-align: center;
    border-radius: 2px;

    a {
      display: block;
      width: 100%;
      height: 100%;
      color: #333;
    }

    &::after {
      @include border-retina(surround, #666);

      border-color: #bbb;
      border-radius: 5px;
    }
  }
}

.clearfix {
  &::after {
    display: block;
    height: 0;
    clear: both;
    content: '';
    visibility: hidden;
  }
}
</style>
