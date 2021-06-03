<template>
  <common-list
    ref="list"
    :params="params"
    :request="request"
    loading-text="正在加载内容列表"
  >
    <empty slot="empty" message="这个目录下还没有内容哦" />
    <goods-card-lite
      slot-scope="props"
      v-theme="{
        main: {
          '.title .text': isLearning(props.item) ? 'color!important' : '',
        },
      }"
      :data-alias="props.item.alias"
      :alias="props.item.alias"
      :img="props.item.cover"
      :media-type="props.item.mediaType"
      :title="props.item.title"
      :desc-tag="getDescTag(props.item)"
      :button-text="getButtonText(props.item)"
      @click="click(props.item)"
    >
      <!-- 已学完。。。 -->
      <div>
        <span
          v-for="(text, index) in getDescList(props.item)"
          :key="index"
          class="desc-item"
        >
          {{ text }}
        </span>
      </div>
    </goods-card-lite>
  </common-list>
</template>

<script>
import { CommonList } from '@youzan/vis-ui';
import GoodsCardLite from '@/components/goods-card-lite';
import { throttle } from 'lodash';
import { MEDIA_TYPE, MEDIA_TYPE_FREE_BUTTON } from '@/constants/course/media-type';
import { getContentAndLive } from '../../api';
import storeName from '../../name';
import Empty from '../Empty';
import { getContentDescList, getLiveStatusTagConfig } from './utils';

export default {
  name: 'content-list',
  storeName,

  components: {
    // 'van-loading': Loading,
    Empty,
    CommonList,
    GoodsCardLite,
  },

  props: {
    /** 章节 id */
    chapterId: {
      type: Number,
      default: 0,
    },
    /** 是否可见 */
    visible: {
      type: Boolean,
      default: false,
    },
    /** 是否需要判断滚动 **/
    needCheckViewChange: {
      type: Boolean,
      default: false,
    },
    /** 是否需要排序（监听排序） */
    sortable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      page: 1,
    };
  },

  // rootState Block 里都可以读取到，所以不用 props
  rootState: ['goodsData', 'sortType', 'contentProgress', 'columnProgress'],

  computed: {
    params() {
      return {
        alias: this.goodsData.alias,
        page: this.page,
        sortType: this.sortType,
      };
    },
  },

  watch: {
    sortType() {
      if (!this.sortable) {
        return;
      }
      this.page = 1;
    },
    visible() {
      if (this._checked) {
        return;
      }
      this.$refs.list.check();
      this._checked = true;
    },
  },

  mounted() {
    if (!this.needCheckViewChange) {
      return;
    }
    this._scrollCallback = throttle(() => {
      if (!this.visible) {
        return;
      }
      const $dom = this.$refs?.list?.$el;
      if (!$dom) {
        return;
      }
      const vh = window.innerHeight;
      const { top, bottom } = $dom.getBoundingClientRect() || {};
      if (top <= 88 && bottom >= vh) {
        this.$emit('viewChange', true, this.onClose);
      } else {
        this.$emit('viewChange', false, this.onClose);
      }
    }, 500);
    window.addEventListener('scroll', this._scrollCallback);
  },

  destroyed() {
    if (this._scrollCallback) {
      window.removeEventListener('scroll', this._scrollCallback);
    }
  },

  created() {
    this._checked = false;
  },

  methods: {
    // 透传 van-list 中的 check 方法
    check() {
      this.$refs.list.check();
    },

    onClose() {
      const $el = this.$parent?.$parent?.$el;
      if ($el) {
        $el.scrollIntoView();
        window.scrollBy({
          top: -50,
          left: 0,
          behavior: 'smooth',
        });
      }
    },

    request({ alias, page, sortType }) {
      if (!this.sortable) {
        sortType = '';
      }
      return getContentAndLive(alias, page, sortType, this.chapterId).then(
        (res) => {
          // 触发设置数量
          this.$emit('setContentCount', res.total);
          return {
            list:
              res.content &&
              res.content.map((item) => ({ ...item, pageNumber: page })),
            hasNext: page < res.totalPages,
          };
        },
      );
    },

    // desc-tag 目前是直播状态
    getDescTag(item) {
      if (item.mediaType === MEDIA_TYPE.LIVE) {
        return getLiveStatusTagConfig(item.liveStatus, item.liveType);
      }
      return { text: '', color: '' };
    },
    // 描述列表
    getDescList(item) {
      return getContentDescList(item, this.goodsData.isOwnAsset, this.contentProgress);
    },

    isLearning(item) {
      if (this.columnProgress.alias === item.alias) {
        const progress = this.contentProgress[`c-${item.alias}`] || {};
        if (progress.percent !== 100) {
          return true;
        }
      }
      return false;
    },

    getButtonText(item) {
      if (this.isLearning(item)) {
        return '继续学习';
      }
      if (!this.goodsData.isOwnAsset && item.isFree && item.mediaType) {
        return MEDIA_TYPE_FREE_BUTTON[item.mediaType];
      }
    },

    click(item) {
      // block 里都可以触发 $rootDispatch
      this.$rootDispatch('updateColumnProgress', {
        lastPage: item.pageNumber,
        title: item.title,
        alias: item.alias,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.no-data-wrap {
  padding: 88px 0;
  font-size: 12px;
  color: $disabled-color;
  text-align: center;

  .no-data-icon {
    display: block;
    margin: 0 auto 20px;
  }
}

.desc-item {
  position: relative;
  float: left;
  margin-right: 8px;

  &::after {
    @include border-retina(right, $disabled-color);

    top: 2px;
    height: 24px;
    margin: 0 4px;
  }

  &:last-child {
    margin-right: 0;

    &::after {
      border-right: 0 none;
    }
  }
}
</style>
