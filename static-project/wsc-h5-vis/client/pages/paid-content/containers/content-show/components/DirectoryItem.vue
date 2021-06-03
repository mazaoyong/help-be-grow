<template>
  <div class="wrap-bars" @click="onNavigation">
    <!-- 顶线 -->
    <!-- <div v-if="showTopLine" class="promotion-line" /> -->
    <!-- 上次学到 -->
    <van-tag
      v-if="isLastStudy"
      class="column-prev__tag theme_plain"
      round
    >
      继续学习
    </van-tag>
    <!-- 内容 -->
    <div class="column-bars">
      <div class="column-bars__type">
        {{ typeSuffix }}
      </div>
      <div class="column-bars__desc">
        <p
          :class="[
            'column-bars__desc-title',
            {'column-bars__desc-title--theme' : isLastStudy},
            {'column-bars__desc-title--done' : (progress.percent === 100)}
          ]"
        >
          {{ item.title }}
        </p>
        <p :class="['column-bars__desc-status', {'column-bars__desc-title--done' : (progress.percent === 100)}]">
          <span v-if="item.mediaType === 3">
            {{ videoTime }}
          </span>
          <span>
            <span v-if="item.mediaType === 3 && itemProgress" class="content-separator" />
            <span>{{ itemProgress }}</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import buildUrl from '@youzan/utils/url/buildUrl';
import { secondsToColonTimeStr } from 'pct/utils';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'directory-item',

  components: {
    'van-tag': Tag,
  },

  props: {
    showTopLine: {
      type: Boolean,
      default: true,
    },
    item: Object,
    progress: Object,
    lastStudy: String,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
    };
  },

  computed: {
    url() {
      if (!this.item.alias) return 'javascript:;';
      // 跳转直播链接
      if (this.item.mediaType === 4) {
        return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`, '', this.kdtId);
      }
      // 跳转内容链接
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=contentshow&alias=${this.item.alias}`, '', this.kdtId);
    },
    typeSuffix() {
      return [
        '',
        '图文',
        '音频',
        '视频',
        '直播',
      ][+this.item.mediaType];
    },
    videoTime() {
      const timeStr = this.item.mediaType === 3 && this.item.videoDuration ? secondsToColonTimeStr(this.item.videoDuration) : '';
      return timeStr;
    },
    itemProgress() {
      let str = '未开始';
      if (this.progress.percent) {
        str = +this.progress.percent === 100 ? '已学完' : `已学${this.progress.percent}%`;
      }
      return str;
    },
    isLastStudy() {
      return +this.progress.percent !== 100 && this.lastStudy === this.item.alias;
    },
  },

  methods: {
    onNavigation() {
      if (!this.item.alias) return;

      if (this.item.mediaType === 4) {
        const url = buildUrl(
          `/wscvis/knowledge/index?page=livedetail&alias=${this.item.alias}&kdt_id=${this.kdtId}#/livedetail`,
          '',
          this.kdtId,
        );
        SafeLink.redirect({
          url,
          kdtId: this.kdtId,
        });
        return;
      }

      this.$router.push({ name: 'ContentShow', query: { alias: this.item.alias } });
      this.$emit('navigation');
    },
  },
};
</script>

<style lang="scss">
@import 'var';
@import 'mixins/index.scss';

.wrap-bars {
  display: block;
  overflow: hidden;
  position: relative;
}

.column-prev__tag {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 8px;
  background: #fff;
}

.promotion-line {
  border-top: 1px solid #f2f2f2;
  margin-left: 15px;
}

.column-bars {
  padding-left: 15px;
  display: flex;

  &__type {
    width: 34px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 12px;
    font-size: 12px;
    color: #969799;
    margin-right: 10px;
    background: #ebedf0;
    color: #323233;
    margin-top: 15px;
    transform: scale(.83);
  }

  &__desc {
    box-sizing: border-box;
    flex: 1;
    width: 300px;
    padding: 15px 15px 15px 0;
    border-bottom: 1px solid #f2f3f5;
    min-height: 73px;

    &-title {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      margin-bottom: 4px;
      color: #323233;

      @include ellipsis;

      &--done {
        color: #c8c9cc !important;
      }
    }

    &-status {
      font-size: 11px;
      color: #969799;
      line-height: 16px;
    }
  }
}
</style>
