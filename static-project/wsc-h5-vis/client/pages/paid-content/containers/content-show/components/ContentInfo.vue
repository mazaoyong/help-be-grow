<template>
  <div class="content-info">
    <div class="content-info__main">
      <slot name="main" />
      <div
        :class="['content-info__firstline',
                 { 'content-info__firstline-share': !showDirectory && contentData.alias }
        ]"
      >
        <h2
          :class="['content-info__title',
                   { 'content-info__title-share': !showDirectory && contentData.alias }]
          "
        >
          {{ contentData.title }}
        </h2>
        <div v-if="showDirectory" class="content-info__firstline-right">
          <div class="content-info__separator" />
          <div class="content-info__table" @click="onContentsDirectory">
            <svg-icon symbol="bars" class="content-info__table-bars" />
            <span>目录</span>
          </div>
        </div>
        <share-btn v-if="!showDirectory && contentData.alias" :url="shareUrl" />
      </div>
      <div class="content-info__info">
        <div class="content-info__desc">
          <p v-if="pageView" class="content-info__item">
            <span class="content-info__item-title">{{ mediaSuffix }}</span>
            <span>{{ pageView }}次</span>
          </p>
          <p v-if="contentData.author" class="content-info__item">
            <span class="content-info__item-title">作者</span>
            <span>{{ contentData.author }}</span>
          </p>
          <p v-if="publishAt" class="content-info__item">
            <span class="content-info__item-title">时间</span>
            <span>{{ publishAt }}</span>
          </p>
        </div>

        <!-- 视频倍速按钮 -->
        <div
          v-if="showRateBtn"
          class="btn-playrate"
          @click="onPlayRateClick"
        >
          倍速播放：{{ videoPlayRate | toDecimal }}X
        </div>

        <div class="content-info__aside">
          <slot name="aside" />
        </div>
      </div>
    </div>

    <van-popup
      v-model="showContentsDirectoryPop"
      position="bottom"
      class="content-info__pop"
      :style="{ height: `${popupHeight}px` }"
    >
      <div class="list__title">
        <span>专栏目录</span>
        <span>({{ listTotal }})</span>
        <!-- 排序 -->
        <div class="column-directory__sort" @click="onSetSort">
          <svg-icon
            v-if="columnSort === 'desc'"
            class="column-directory__sort-icon"
            symbol="sort_reverse"
          />
          <svg-icon
            v-else
            class="column-directory__sort-icon"
            symbol="sort"
          />
          <div class="column-directory__sort-text">
            {{ columnSort === 'desc' ? '倒序' : '正序' }}
          </div>
        </div>
        <van-icon
          name="cross"
          class="list__title--close"
          @click="onClosePop"
        />
      </div>

      <div class="list">
        <van-list
          v-model="isListLoading"
          :finished="isListFinished"
          @load="onLoadMoreContents"
        >
          <template v-if="contentList.length">
            <directory-item
              v-for="(item, index) in contentList"
              :key="item.alias"
              :show-top-line="index === 0 ? false : true"
              :item="item"
              :progress="progresses[`c-${item.alias}`] || {}"
              :last-study="laststudyAlias"
              @navigation="onNavigation"
            />
          </template>

          <no-data v-else>
            该专栏还没有设置内容哦
          </no-data>
        </van-list>
        <van-goods-action>
          <van-goods-action-button
            class="main-btn"
            text="关闭"
            @click="onClosePop"
          />
        </van-goods-action>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, List, Icon, GoodsAction, GoodsActionButton } from 'vant';
import { format } from 'date-fns';
import UA from 'zan-utils/browser/ua_browser';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import DirectoryItem from './DirectoryItem';
import NoData from '../../../components/NoData';
import SvgIcon from 'components/svg-icon';
import apis from 'pct/api';
import { formatSalesNum, getMediaSuffix } from 'common/utils/hide-info';
import ShareBtn from '../../../components/ShareBtn';

export default {
  name: 'content-info',

  components: {
    'van-popup': Popup,
    'van-list': List,
    'van-icon': Icon,
    'van-goods-action': GoodsAction,
    'van-goods-action-button': GoodsActionButton,
    DirectoryItem,
    NoData,
    SvgIcon,
    ShareBtn,
  },

  filters: {
    toDecimal(value) {
      return value.toFixed(1);
    },
  },

  props: {
    columnSort: {
      type: String,
      default: 'desc',
    },
    contentData: {
      type: Object,
      default() { return {}; },
    },
    showDirectory: {
      type: Boolean,
      default: false,
    },
    videoPlayRate: {
      type: Number,
      default: 1.0,
    },
    isOwned: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const isMobile = UA.isMobile();

    return {
      isIOS: UA.isIOS(),
      isAndroid: UA.isAndroid(),
      isWeixin: UA.isWeixin(),
      showContentsDirectoryPop: false,
      contentList: [],
      listTotal: 0,
      isListLoading: false,
      isListFinished: false,
      listPageNumber: 1,
      // 获取进度
      progresses: {},
      // 上次学习
      laststudy: {},
      // 视频封面高度
      videoCoverHeight: isMobile ? window.innerWidth * 0.5625 : 375 * 0.5625,
    };
  },

  computed: {
    publishAt() {
      if (this.contentData.publishAt) {
        return format(this.contentData.publishAt, 'YYYY-MM-DD');
      }
      return '';
    },
    pageView() {
      if (this.contentData.pageView) {
        return formatSalesNum(this.contentData.pageView);
      }
      return '';
    },
    popupHeight() {
      return `${window.innerHeight - this.videoCoverHeight}`;
    },

    laststudyAlias() {
      return this.laststudy[`column-${this.contentData.columnAlias}`] || '';
    },

    shareUrl() {
      const kdtId = window._global.kdt_id;
      return `/wscvis/ump/invite-card?alias=${this.contentData.alias}&kdt_id=${kdtId}&owlType=2`;
    },

    mediaSuffix() {
      return getMediaSuffix(this.contentData.mediaType, true);
    },

    showRateBtn() {
      return this.isOwned &&
        !(this.isAndroid && this.isWeixin) &&
        this.contentData.mediaType === 3 &&
        this.contentData.speedSwitch !== 0;
    },
  },

  watch: {
    columnSort(value) {
      this.listPageNumber = 1;
      this.isListFinished = false;
      this.contentList = [];
      this.onLoadMoreContents();
    },
  },

  created() {
    const pro = YZLocalStorage.getItem('paidcontent:progress') || '{}';
    this.progresses = JSON.parse(pro);
    const laststudy = YZLocalStorage.getItem('paidcontent:laststudy') || '{}';
    this.laststudy = JSON.parse(laststudy);
  },

  methods: {
    onContentsDirectory() {
      this.showContentsDirectoryPop = !this.showContentsDirectoryPop;
    },
    onSetSort() {
      this.$emit('changeSort', { type: this.columnSort === 'asc' ? 'desc' : 'asc' });
    },
    onLoadMoreContents() {
      if (this.contentData.columnAlias) {
        this.isListLoading = true;

        apis.getContentsAndLives({
          alias: this.contentData.columnAlias || '',
          sort_type: this.columnSort,
          page_no: this.listPageNumber,
        })
          .then(data => {
            const { list = [], total = 0 } = data;
            this.contentList = this.contentList.concat(list);
            this.listTotal = total;
            if (this.contentList.length >= this.listTotal) {
              this.isListFinished = true;
            }
            this.listPageNumber = this.listPageNumber + 1;
            this.isListLoading = false;
          })
          .catch(() => {
            this.isListLoading = false;
          });
      }
    },
    onClosePop() {
      this.showContentsDirectoryPop = false;
    },

    onPlayRateClick() {
      let toRate = this.videoPlayRate + 0.5;
      if (toRate > 2) toRate = 0.5;
      this.$emit('video-playrate-change', toRate);
    },

    onNavigation() {
      const pro = YZLocalStorage.getItem('paidcontent:progress') || '{}';
      this.progresses = JSON.parse(pro);
      const laststudy = YZLocalStorage.getItem('paidcontent:laststudy') || '{}';
      this.laststudy = JSON.parse(laststudy);
      this.showContentsDirectoryPop = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
@import "components/custom_richtext.scss";
$col-dark: #969799;

.content-info {
  position: relative;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  user-select: none;

  .pricetag  {
    margin-top: 0px;
    margin-bottom: 10px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    position: relative;
    min-height: 24px;
  }

  &__item {
    padding-bottom: 8px;
    font-size: 12px;
    line-height: 16px;

    &-title {
      color: #969799;
      padding-right: 16px;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  /* 倍速播放按钮 */
  .btn-playrate {
    display: inline-block;
    margin-top: 10px;
    padding: 0 13px;
    line-height: 22px;
    font-size: 12px;
    color: #7d7e80;
    border: 1px solid #c8c9cc;
    border-radius: 12px;
  }

  .mask {
    background-color: rgba(0, 0, 0, 0);
  }

  &__main {
    width: 100%;
  }

  &__firstline {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    min-height: 44px;
    position: relative;
    margin: 0 -16px 12px;
    padding: 0 16px;

    &-share {
      min-height: auto;
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }
  }

  &__separator {
    width: 1px;
    height: 38px;
    background-color: #f2f3f5;
    margin: 0 15px;
  }

  &__table {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 10px;
    color: $col-dark;
    height: 42px;
    width: 24px;
    justify-content: space-around;
    padding-top: 2px;

    &-bars {
      width: 14px;
      height: 13px;
    }
  }

  &__title {
    line-height: 26px;
    font-size: 18px;
    font-weight: 700;
    word-break: break-all;
    color: #323233;

    &-share {
      padding-right: 46px;
    }
  }

  &__desc {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
  }

  &__author {
    margin-top: 10px;
    line-height: 16px;
    color: $col-dark;
    font-size: 12px;
  }

  &__status-list {
    margin-top: 8px;
    line-height: 0;
  }

  &__status {
    display: inline-block;
    padding: 0 8px;
    line-height: 16px;
    vertical-align: middle;
    color: $col-dark;
    font-size: 12px;
    border-right: 1px solid #e5e5e5;
  }

  &__status:first-child {
    padding-left: 0;
  }

  &__status:last-child {
    border-right: none;
  }

  &__content-title {
    font-size: 14px;
    color: #9b9b9b;
    padding: 20px 0 14px 15px;
  }

  &__aside {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .column-directory__sort {
    margin-right: auto;
    margin-left: 8px;
    padding-left: 8px;
    border-left: 1px solid #d8d8d8;
  }

  .list__title {
    padding: 15px;
    font-size: 14px;
    color: #333;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 99;
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
      color: #323233;
    }

    &--close {
      float: right;
      font-size: 22px;
      color: #969799;
    }
  }

  &__pop {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    min-height: 320px;
    padding-bottom: 50px;

    .main-btn {
      margin: 5px 16px;
    }
  }
  .column-direcory__progress {
    background: #fff;
    padding: 12px 15px 0px;
  }
  .column-direcory__progress-btn {
    display: flex;
    padding: 13px 12px;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    line-height: 1.38;
    color: #ffffff;
    border-radius: 4px;
    background-color: #00b389;
  }
  .column-direcory__progress-btn span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.column-directory {
  &__sort {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: flex-end;

    &-icon {
      width: 14px;
      height: 11px;
      margin-right: 3px;
      display: inline-block;
    }

    &-text {
      display: inline-block;
      line-height: 10px;
    }
  }
}

.is-iphonex {
  .content-info__pop {
    padding-bottom: 84px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 50px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 50px);
  }
}
</style>
