<template>
  <vis-popup
    :show-pop="displayValue"
    @close-pop="closePopup"
  >
    <div class="invite-img__wrap">
      <img
        :src="genImageList"
        class="invite-img__wrap-content"
      >
    </div>
  </vis-popup>
</template>

<script>
import { Toast } from 'vant';
import { PopupClose } from '@youzan/vis-ui';
import popupMixins from '../../../mixins/popup.js';
import { draw } from '../drawCard.js';
import { uploadNetMaterial, invoke } from '../../../utils.js';

let cacheCard = '';

export default {
  name: 'card-share',

  components: {
    'vis-popup': PopupClose,
  },

  mixins: [popupMixins],

  props: {
    drawInfos: [Object],
  },

  data() {
    return {
      genImageList: '',
      cdnAvatarSrc: '',
      qrSrc: '',
    };
  },

  watch: {
    displayValue(newValue) {
      if (newValue) {
        if (cacheCard) {
          this.genImageList = cacheCard;
        } else {
          this.initDrawInfos();
        }
      }
    },
  },

  mounted() {
  },

  methods: {
    close() {
      console.log('sdasdas');
    },
    initDrawInfos() {
      Toast('正在初始化数据...');

      this.getAvatar(this.drawInfos.avatarSrc)
        .then(cdnAvatarSrc => {
          this.cdnAvatarSrc = cdnAvatarSrc;
          return this.getQrCode();
        })
        .then(qrCode => {
          this.qrSrc = qrCode;
          const cardInfo = {
            ...this.drawInfos,
            avatarSrc: this.cdnAvatarSrc,
            qrSrc: this.qrSrc,
          };
          this.genImage(cardInfo);
        })
        .catch((err) => {
          console.warn(err);
          Toast('初始化分享失败，请刷新重试');
        });
    },
    getQrCode() {
      const sUrl = this.drawInfos.shareUrl || '';
      if (sUrl.indexOf('http') === 0) {
        return invoke(uploadNetMaterial, sUrl)
          .then(res => {
            return res.url;
          });
      }
      return sUrl;
    },
    // 生成cdn avatar
    getAvatar(avatarSrc) {
      return invoke(uploadNetMaterial, avatarSrc)
        .then(res => {
          return res.url;
        });
    },
    // 绘图
    genImage(cardInfo) {
      Toast('加载中...');
      return draw(cardInfo)
        .then((canvasImg) => {
          console.log(canvasImg);
          this.genImageList = canvasImg;
          cacheCard = canvasImg;
          Toast.clear();
        })
        .catch((err) => {
          console.log(err);
          Toast.clear();
          Toast('生成图片失败，请刷新重试');
        });
    },
  },
};
</script>

<style lang="scss">
  .invite-img {
    &__wrap {
      background: #fff;
      width: 300px;
      height: 530px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 8px;

      &-content {
        width: 100%;
      }
    }
  }
</style>
