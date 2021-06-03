<template>
  <div class="poster-swiper">
    <Swiper :page-count="posterBgList">
      <swiper-item
        v-for="(item, index) in posterBgList"
        :key="index"
        :index="index"
        :is-active="index === 0"
      >
        <poster-card
          :poster-bg="item.bg"
          :type="item.type"
          :poster-info="posterInfo"
          :is-start="item.isStart"
          :new-stu-reward-tip="newStuRewardTip"
          :new-stu-reward-tip-simple="newStuRewardTipSimple"
        />
      </swiper-item>
    </Swiper>
  </div>
</template>
<script>
import Swiper from './swiper';
import SwiperItem from './swiper-item';
import PosterCard from './poster-card';

import Args from 'zan-utils/url/args';
import { getCommonWeappCode, getCommonSwanCode } from '@/common-api/utils';
import { getQrCode } from '@/common-api/qr-code';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { POSTER_CUSTOM_BG, POSTER_DEFAULT_BG, POSTER_DEFINITION_BG, POSTER_SETTING_TYPE } from '../../../constants';

import { getCurrentUserInfo } from '../../../utils';

const { mp_data: mpData = {}, miniprogram = {}, kdt_id: kdtId } = window._global || {};

const alias = Args.get('alias') || '';

const currentUserInfo = getCurrentUserInfo();

export default {
  name: 'poster-swiper',

  components: {
    Swiper,
    SwiperItem,
    PosterCard,
  },

  data() {
    return {
      posterBgList: [],
      posterDefinitionBg: POSTER_DEFINITION_BG,
      showPosterPopup: false,
      previewUrl: '',
      baseInfo: {
        shopName: mpData.shop_name,
        shopLogo: mpData.logo,
        qrCode: '',
      },
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
  },

  computed: {
    isCustom() {
      return this.posterBgList[0].type === 'custom';
    },

    posterInfo() {
      let type;
      const posterType = this.posterBgList[0].type;
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

  watch: {
    customizePosters() {
      this.formatPosterBgList();
    },

    introducerPosterSetting() {
      this.formatPosterBgList();
    },

    posterStyle() {
      this.formatPosterBgList();
    },
  },

  created() {
    this.formatPosterBgList();
    this.fetchQrcode().then((qrCode) => {
      this.baseInfo.qrCode = qrCode;
    });
  },

  methods: {
    formatPosterBgList() {
      const { introducerPosterSetting = [], customizePosters = [], posterStyle } = this;
      let defaultPosters = [];
      this.posterBgList = [];
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
          alias,
          introducerUserId: currentUserInfo.buyerId,
        },
      });
      if (isWeapp) {
        return getCommonWeappCode({
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(shareUrl),
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
  },
};
</script>
<style lang="scss" scoped>
.poster-swiper {
  position: relative;
  padding-bottom: 56px;
}
</style>
