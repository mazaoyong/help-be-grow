<template>
  <div class="poster-swiper">
    <Swiper @change="onPosterChange">
      <swiper-item v-for="(item, index) in posterBgList" :key="index" :index="index">
        <poster-card
          :poster-bg="item.bg"
          :type="item.type"
          :poster-info="posterInfo"
          :is-start="item.isStart"
          :new-stu-reward-tip="newStuRewardTip"
          :new-stu-reward-tip-simple="newStuRewardTipSimple"
          :current-index="currentIndex"
          @upload-change="onImgChange"
          @finished="onPosterLoaded"
          @share="onShare"
          @toggle-show-save-guide="toggleShowSaveGuide"
        />
      </swiper-item>
    </Swiper>
    <!-- 海报弹窗 -->
    <poster-popup v-model="showPosterPopup" :url="previewUrl" @share="onShare" />
    <save-poster-guide v-if="posterInfo.type !== 'custom' && showPosterSaveGuide" />
  </div>
</template>
<script>
import Swiper from './swiper';
import SwiperItem from './swiper-item';
import PosterCard from './poster-card';
import SavePosterGuide from '../save-poster-guide';
import PosterPopup from '../poster-popup';

import { getCommonWeappCode, getCommonSwanCode } from '@/common-api/utils';
import { getQrCode } from '@/common-api/qr-code';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { POSTER_CUSTOM_BG, POSTER_DEFAULT_BG, POSTER_DEFINITION_BG, POSTER_SETTING_TYPE } from '../../../constants';

import { getCurrentUserInfo } from '../../../utils';

const { mp_data: mpData = {}, miniprogram = {}, kdt_id: kdtId } = window._global || {};

const currentUserInfo = getCurrentUserInfo();

export default {
  name: 'poster-swiper',

  components: {
    Swiper,
    SwiperItem,
    PosterCard,
    PosterPopup,
    SavePosterGuide,
  },

  data() {
    return {
      posterBgList: [],
      posterDefinitionBg: POSTER_DEFINITION_BG,
      showPosterPopup: false,
      currentIndex: 0,
      previewUrl: '',
      baseInfo: {
        shopName: mpData.shop_name,
        shopLogo: mpData.logo,
        qrCode: '',
      },
      showPosterSaveGuide: false,
    };
  },
  props: {
    newStuRewardTip: {
      type: String,
    },
    newStuRewardTipSimple: {
      type: String,
    },
    introducerPosterSetting: {
      type: Array,
      default: () => [],
    },
    customizePosters: {
      type: Array,
      default: () => [],
    },
    introducer: {
      type: Object,
      default: () => ({
        avatar: '',
        name: '',
      }),
    },
    posterStyle: {
      type: Number,
      default: 1,
    },
    alias: {
      type: String,
    },
  },

  computed: {
    isCustom() {
      return this.posterBgList[this.currentIndex].type === 'custom';
    },

    posterInfo() {
      let type;
      const posterType = this.posterBgList[this.currentIndex].type;
      const { introducer } = this;
      const { name, avatar } = introducer;
      if (posterType === 'custom') {
        type = 'custom';
      } else if (posterType === 'definition') {
        type = 'definition';
      } else {
        type = 'default';
      }
      return {
        ...Object.assign(this.baseInfo, {}),
        type,
        name,
        avatar,
      };
    },
  },

  created() {
    this.formatPosterBgList();
    this.fetchQrcode().then((qrCode) => {
      this.baseInfo.qrCode = qrCode;
      this.onPosterChange(0);
    });
  },

  methods: {
    formatPosterBgList() {
      const { introducerPosterSetting = [], customizePosters = [], posterStyle } = this;
      let defaultPosters = [];

      introducerPosterSetting.forEach((setting) => {
        if (setting === POSTER_SETTING_TYPE.DEFINITION && customizePosters[0]) {
          const definitionBg = customizePosters[0];
          this.posterDefinitionBg.bg = definitionBg;
          this.posterBgList.push(this.posterDefinitionBg);
        } else {
          defaultPosters = [POSTER_DEFAULT_BG[posterStyle - 1]];
        }
      });

      if (defaultPosters.length > 0) {
        this.posterBgList = this.posterBgList.concat(defaultPosters);
      }
      this.posterBgList.push(POSTER_CUSTOM_BG);
    },

    fetchQrcode() {
      const { isWeapp, isSwanApp } = miniprogram;
      const shareUrl = customSafeLink.getSafeUrl({
        url: '/wscvis/ump/introduction/new-student',
        kdtId,
        query: {
          kdt_id: kdtId,
          alias: this.alias,
          introducerUserId: currentUserInfo.buyerId,
        },
      });
      if (isWeapp) {
        return getCommonWeappCode({
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(shareUrl),
          hyaLine: true,
        });
      } else if (isSwanApp) {
        return getCommonSwanCode({
          targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
        });
      } else {
        return getQrCode({
          url: shareUrl,
          isShortenUrl: true,
        }).then((res) => {
          return res.data;
        });
      }
    },

    // 切换海报
    onPosterChange(index) {
      this.currentIndex = index;
      const currentItem = this.posterBgList[this.currentIndex];
      const { type, isLoaded } = currentItem;
      if (type === 'custom' || isLoaded) {
        return;
      }
      currentItem.isStart = true;
      this.$set(this.posterBgList, this.currentIndex, currentItem);
    },

    // 更换图片
    onImgChange(img) {
      const customPosterIndex = this.posterBgList.length - 1;
      const currentItem = this.posterBgList[customPosterIndex];
      currentItem.isStart = true;
      currentItem.bg = img;
      this.$set(this.posterBgList, customPosterIndex, currentItem);
    },

    // 海报绘制完成
    onPosterLoaded(img = '', posterIndex = this.currentIndex) {
      const currentItem = this.posterBgList[posterIndex];
      if (currentItem.type === 'custom') {
        if (img) {
          this.previewUrl = img;
          this.showPosterPopup = true;
        }
        currentItem.isLoaded = !!img;
      }
      if (img) {
        currentItem.bg = img;
      }
      if (!currentItem.isLoaded) {
        currentItem.isLoaded = !!img;
      }
      currentItem.isStart = false;
      this.$set(this.posterBgList, posterIndex, currentItem);
    },

    toggleShowSaveGuide(isShow) {
      this.showPosterSaveGuide = isShow;
    },

    onShare() {
      this.$emit('share');
    },
  },
};
</script>
<style lang="scss" scoped>
.poster-swiper {
  position: relative;
  padding-bottom: 56px;
}
</style>
