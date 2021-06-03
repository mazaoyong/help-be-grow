<template>
  <div>
    <div class="title-area">
      <div class="title-area__left">
        <mini-font-tag
          v-if="titleTag"
          class="title-tag"
          :text="titleTag"
          :background-color="mainColor"
        />
        <span class="title">
          {{ goodsData.title }}
        </span>
      </div>
      <div class="title-area__right">
        <share-btn />
      </div>
    </div>
    <p v-if="goodsData.subTitle" class="sell-point">
      {{ goodsData.subTitle }}
    </p>
    <div v-if="goodsData.courseTag && goodsData.courseTag.length" class="course-tag">
      <mini-font-tag
        v-for="(item, index) in goodsData.courseTag"
        :key="index"
        :text="item.tag"
        class="course-tag-item"
        height="22px"
      />
    </div>

    <div v-if="soldNum" class="sold">
      {{ soldNum }}人学过
    </div>

    <KnowledgeInfo />
    <div v-if="isShowVideoRateButton" class="video-rate-button" @click="onToggleVideoPlayRate">
      <van-tag round plain>
        倍速播放: {{ videoPlayRate }}x
      </van-tag>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import MiniFontTag from '@/components/mini-font-tag';
import { isX5 } from '@/common/utils/env';
import ua from '@youzan/utils/browser/ua';
import formatSalesNum from '@/pages/course/detail/utils/format-sales-num';
import ShareBtn from './share-btn';
import KnowledgeInfo from './knowledge-info';

import { VIDEO_PLAY_RATE } from '../../../../pic/pct-image-block/constants';

const VIDEO_RATE_MAP = VIDEO_PLAY_RATE.reduce(
  (acc, item, idx, arr) => {
    acc[item] = arr[idx - 1] || arr[VIDEO_PLAY_RATE.length - 1];
    return acc;
  },
  Object.create(null),
);

export default {
  components: {
    MiniFontTag,
    KnowledgeInfo,
    ShareBtn,
    'van-tag': Tag,
  },

  rootState: ['goodsData', 'videoPlayRate', 'env'],
  rootGetters: ['isOfflineCourse', 'isVideo'],
  computed: {
    isAndroid() {
      return ua.isAndroid();
    },
    isShowVideoRateButton() {
      const src = this.goodsData.fullContent || '';
      const isHLS = src.indexOf('.m3u8') > -1;
      let showRateBtn = true;

      // 安卓平台非x5内核浏览器，不提供倍速播放功能
      if (isHLS) {
        showRateBtn = !(this.isAndroid && !isX5());
      }

      return this.goodsData.isOwnAsset &&
        this.isVideo &&
        this.goodsData.speedSwitch &&
        showRateBtn;
    },

    titleTag() {
      return this.goodsData.courseTypeName;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    soldNum() {
      if (this.isOfflineCourse && this.goodsData.soldNum) {
        return formatSalesNum(this.goodsData.soldNum);
      }
      return '';
    },
  },

  methods: {
    onToggleVideoPlayRate() {
      const currentRate = this.videoPlayRate;
      const newRate = VIDEO_RATE_MAP[currentRate];
      this.$rootCommit('toggleVideoPlayRate', newRate);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.title-area {
  position: relative;
  display: flex;
  align-items: center;

  &__left {
    flex: 1;
  }
  &__right {
    min-width: 60px;
    text-align: right;
  }

  .title-tag {
    padding: 0 2px;
    margin-right: 4px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
    color: $main-text-color;
    word-break: break-all;
    vertical-align: middle;
  }
}

.sell-point {
  @include multi-ellipsis(2);

  margin-top: 12px;
  font-size: 12px;
  line-height: 18px;
  color: $main-text-color;
}

.course-tag {
  margin: 12px -4px -4px -1px;

  .course-tag-item {
    margin: 0 4px 4px 0;
    color: $vice-text-color;
    background-color: $background-color;
  }
}

.video-rate-button{
  margin-top: 8px;
}

.sold {
  margin-top: 12px;
  font-size: 12px;
  color: $main-text-color;
}
</style>
