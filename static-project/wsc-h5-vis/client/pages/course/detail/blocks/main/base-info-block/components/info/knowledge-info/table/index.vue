<template>
  <table v-if="infoList.length" class="table">
    <tr v-for="(item, index) in infoList" :key="index" class="knowledge-info-line">
      <td>
        <span class="knowledge-info-label">{{ item.label }}</span>
      </td>
      <td>
        <span>{{ item.content }}</span>
        <span v-if="item.subContent" class="knowledge-info-sub-value">
          {{ item.subContent }}
        </span>
        <mini-font-tag
          v-if="item.tag"
          class="knowledge-info-tag"
          height="16px"
          :text="item.tag.text"
          :color="item.tag.color"
          :background-color="item.tag.backgroundColor"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import formatDate from '@youzan/utils/date/formatDate';
import { fns } from '@youzan/vue-theme-plugin';
import { getLiveStatusDesc } from 'common/utils/live-status';
import MiniFontTag from '@/components/mini-font-tag';
import { MEDIA_TYPE_SUFFIX } from '@/constants/course/media-type';
import { LIVE_STATUS } from '@/constants/course/live-status';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import formatSalesNum from '@/pages/course/detail/utils/format-sales-num';

export default {
  components: {
    MiniFontTag,
  },

  rootState: ['goodsData'],
  rootGetters: ['isColumn', 'isContent', 'isLive'],

  computed: {
    // 商品是否停售
    isUnsell() {
      return this.goodsData.status === GOODS_STATUS.UNSELL;
    },
    // 更新描述
    updateDesc() {
      if (this.isColumn && this.goodsData.isUpdate && this.goodsData.contentsCount) {
        return `已更新${this.goodsData.contentsCount}期`;
      }
      return '';
    },
    infoList() {
      const list = [];
      if (this.goodsData.pageView) {
        list.push({
          label: MEDIA_TYPE_SUFFIX[this.goodsData.mediaType],
          content: `${formatSalesNum(this.goodsData.pageView)}次`,
        });
      }
      if (this.goodsData.subscriptionsCount) {
        list.push({
          label: '已学',
          content: `${formatSalesNum(this.goodsData.subscriptionsCount)}人`,
        });
      }
      if (this.goodsData.author) {
        list.push({
          label: this.isContent ? '作者' : '讲师',
          content: this.goodsData.author,
        });
      }
      // 时间描述（附带更新期数，停售状态下不展示）
      if (this.goodsData.publishAt && !this.isLive && !this.isUnsell) {
        const item = {
          label: '时间',
          content: formatDate(this.goodsData.publishAt, 'YYYY-MM-DD'),
        };
        // 附加更新描述
        if (this.updateDesc) {
          item.subContent = this.updateDesc;
        }
        list.push(item);
      }
      // 更新描述（停售状态下不展示时间描述，但要展示更新期数）
      if (this.isUnsell && this.updateDesc) {
        list.push({
          label: '更新',
          content: this.updateDesc,
        });
      }
      if (this.goodsData.liveStartAt) {
        const item = {
          label: '直播时间',
          content: formatDate(this.goodsData.liveStartAt, 'YYYY-MM-DD HH:mm'),
        };
        const text = getLiveStatusDesc(this.goodsData.liveStatus, this.goodsData.liveType);
        if (text) {
          const colorMap = {
            [LIVE_STATUS.UNSTART]: this.$theme.colors.main,
            [LIVE_STATUS.LIVING]: this.$theme.colors.mainText,
            [LIVE_STATUS.REWATCH]: '#646566',
            [LIVE_STATUS.PLAYBACK]: this.$theme.colors.mainText,
            [LIVE_STATUS.PRE_PLAYBACK]: this.$theme.colors.main,
          };
          const backgroundColorMap = {
            [LIVE_STATUS.UNSTART]: fns.hexToRgba(this.$theme.colors.main, 0.1),
            [LIVE_STATUS.LIVING]: this.$theme.colors.main,
            [LIVE_STATUS.REWATCH]: '#f2f3f5',
            [LIVE_STATUS.PLAYBACK]: this.$theme.colors.main,
            [LIVE_STATUS.PRE_PLAYBACK]: fns.hexToRgba(this.$theme.colors.main, 0.1),
          };
          item.tag = {
            text,
            color: colorMap[this.goodsData.liveStatus],
            backgroundColor: backgroundColorMap[this.goodsData.liveStatus],
          };
        }
        list.push(item);
      }
      if (this.goodsData.liveDuration) {
        list.push({
          label: '直播时长',
          content: `${this.goodsData.liveDuration}分钟`,
        });
      }
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.table {
  margin: 24px 0 -8px 0;

  .knowledge-info-line {
    font-size: 12px;
    line-height: 12px;
    color: $main-text-color;

    td {
      vertical-align: top;
    }

    .knowledge-info-label {
      display: block;
      min-width: 24px;
      margin-right: 16px;
      color: $disabled-color;
      text-align: justify;

      &::after {
        display: inline-block;
        width: 100%;
        content: ' ';
      }
    }

    .knowledge-info-sub-value {
      display: inline-block;
      padding-left: 8px;
      margin-left: 8px;
      line-height: 12px;
      border-left: 1px solid #dcdee0;
    }

    .knowledge-info-tag {
      padding: 0 1px;
      margin: -2px 0 0 4px;
    }
  }
}
</style>
