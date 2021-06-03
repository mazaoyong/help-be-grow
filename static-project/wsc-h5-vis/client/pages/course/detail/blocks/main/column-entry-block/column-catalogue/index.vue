<template>
  <div class="column-catalogue">
    <div v-log="['view_column_catalogue', '查看专栏目录']" @click="showPopup">
      <van-icon
        name="bars"
        size="20px"
        color="#7d7e80"
      />
      <p class="catalogue-label">
        目录
      </p>
    </div>
    <popup
      v-model="visible"
      :buttons="buttons"
      :class="{ 'android': env.mobileSystem === 'android' }"
      class="column-catalogue-popup"
      get-container="body"
      closeable
    >
      <div slot="title" class="title">
        <span>专栏目录({{ total }})</span>
        <span
          v-if="!hasCustomChapters"
          v-log="['column_catalogue_sort', '专栏目录排序']"
          class="sort"
          @click="$rootDispatch('toggleSortType')"
        >
          <vis-icon
            class="sort-icon"
            size="18px"
            :name="sortType === 'desc' ? 'reverseorder' : 'positivesequence'"
          />
          {{ sortType === 'desc' ? '倒序' : '正序' }}
        </span>
      </div>
      <!-- 分销市场 -->
      <fallback-list
        v-if="isFXContent"
        @onTotalChange="handleTotalChange"
      />
      <chapters
        v-else
        :has-custom-chapters="hasCustomChapters"
        @onHasCustomChaptersChange="handleHasCustomChaptersChange"
        @onTotalChange="handleTotalChange"
      />
    </popup>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { Icon as VisIcon, Popup } from '@youzan/vis-ui';
// import NoData from '@/pages/course/detail/components/no-data';
// import CatalogueItem from './catalogue-item';
import { getContentAndLive } from './api';

import Chapters from './chapters';
import { GOODS_TYPE } from '@/constants/course/goodsType';
import FallbackList from './fallback-list';

export default {
  components: {
    FallbackList,
    'van-icon': Icon,
    VisIcon,
    Popup,
    Chapters,
  },

  data() {
    return {
      visible: false,
      total: 0,
      hasCustomChapters: false,
    };
  },

  rootState: ['goodsData', 'sortType', 'env', 'goodsType'],

  computed: {
    isFXContent() {
      return this.goodsType === GOODS_TYPE.FX_CONTENT;
    },
    buttons() {
      return [{
        text: '关闭',
        color: this.$theme.colors.main,
        onClick: () => {
          this.hidePopup();
        },
      }];
    },

    params() {
      return {
        columnAlias: this.goodsData.column.alias,
        sortType: this.sortType,
      };
    },
  },

  created() {
    this.$rootDispatch('initSortType');
    this.$rootDispatch('initContentProgress');
    this.$rootDispatch('initColumnProgress');
  },

  methods: {
    handleTotalChange(total) {
      this.total = total;
    },
    handleHasCustomChaptersChange(payload) {
      this.hasCustomChapters = payload;
    },
    showPopup() {
      this.visible = true;
    },

    hidePopup() {
      this.visible = false;
    },

    request({ columnAlias, sortType, page }) {
      return getContentAndLive(columnAlias, page, sortType).then(res => {
        this.total = res.total;
        return {
          list: res.content,
          hasNext: page < res.totalPages,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.column-catalogue {
  text-align: center;

  &::after {
    @include border-retina(left, $light-border-color);
  }

  .catalogue-label {
    @include mini-font;

    color: $disabled-color;
  }
}

.column-catalogue-popup {
  // 安卓机型下，popup 过高会被播放器盖住
  &.android {
    ::v-deep .vis-standard-popup__content {
      max-height: 320px !important;
    }
  }

  .title {
    padding: 0 16px;
    font-size: 14px;
    text-align: left;

    .sort {
      position: relative;
      padding-left: 8px;
      margin-left: 12px;
      font-size: 12px;
      font-weight: normal;
      color: $vice-text-color;

      &::after {
        @include border-retina(left, $vice-text-color);
      }

      .sort-icon {
        color: $main-text-color;
        vertical-align: middle;
      }
    }
  }

  .catalogue-item.no-border {
    ::v-deep .content::after {
      @include border-retina(bottom, transparent);
    }
  }

  .empty {
    padding-top: 40px;

    .empty-text {
      margin-top: 20px;
      font-size: 12px;
      color: $disabled-color;
      text-align: center;
    }
  }
}
</style>
