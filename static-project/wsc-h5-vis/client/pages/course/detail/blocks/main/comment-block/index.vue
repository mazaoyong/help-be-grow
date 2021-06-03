<template>
  <div>
    <info-block v-show="total" class="comment-block" sticky>
      <span slot="title">
        留言({{ total }})
        <span
          v-theme:border-color.main
          v-theme:background-color.main
          v-log="['switch_comment', '切换留言类型']"
          class="selected-btn"
          :class="{ unselected: !selected }"
          @click="toggleSelect"
        >精选留言</span>
      </span>
      <write-comment slot="title-right" />
      <p v-if="!isEmpty" class="desc">
        —— 以下内容为{{ selected ? '精选' : '所有' }}留言 ——
      </p>
      <common-list
        ref="list"
        :params="params"
        :request="request"
        :immediate-check="false"
        @empty="empty"
      >
        <!-- 不需要处理非精选留言的 empty 情况，因为非精选留言 empty 时，total 为 0，只展示一个 write-comment -->
        <div slot="empty" class="empty">
          <i class="empty-icon" />
          <p>暂无精选留言</p>
        </div>
        <comment-item
          slot-scope="props"
          :data="props.item"
          @delete="onDelete"
        />
      </common-list>
    </info-block>
    <div v-if="!total" class="write-comment-wrap">
      <write-comment />
    </div>
  </div>
</template>

<script>
import { CommonList } from '@youzan/vis-ui';
import InfoBlock from '@/pages/course/detail/components/info-block';
import WriteComment from './components/write-comment';
import CommentItem from './components/comment-item';
import { getGoodsComment } from './api';

const PAGE_SIZE = 20;

export default {
  components: {
    CommonList,
    InfoBlock,
    WriteComment,
    CommentItem,
  },

  data() {
    return {
      page: 2,

      isEmpty: false,

      // 是否展示精选留言
      selected: true,

      total: 0,
    };
  },

  rootState: ['goodsData'],

  computed: {
    params() {
      return {
        selected: this.selected,
        page: this.page,
      };
    },
  },

  watch: {
    'goodsData.alias'() {
      this.page = 2;
      this.isEmpty = false;
      this.selected = true;
      this.total = 0;
      this.init();
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      getGoodsComment(this.goodsData.alias, 1, PAGE_SIZE, Number(this.selected)).then(res => {
        if (res.totalItems) {
          this.$refs.list.processList(() => res.list);
          this.total = res.totalItems;
        } else {
          this.empty(true);
        }
      });
    },

    empty(isEmpty) {
      this.isEmpty = isEmpty;
    },

    toggleSelect() {
      this.selected = !this.selected;
      this.page = 1;
      this.$refs.list.processList(() => []);
    },

    request({ page, selected }) {
      return getGoodsComment(this.goodsData.alias, page, PAGE_SIZE, Number(selected)).then(res => ({
        list: res.list,
        hasNext: page * PAGE_SIZE < res.totalItems,
      }));
    },

    onDelete(id) {
      this.total -= 1;
      this.$refs.list.processList(list => {
        return list.filter(item => item.id !== id);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.comment-block {
  margin-bottom: 8px;

  .selected-btn {
    position: relative;
    display: inline-block;
    padding: 0 6px;
    margin-left: 8px;
    font-size: 12px;
    font-weight: normal;
    line-height: 20px;
    color: $white;
    border-radius: 10px;
    box-sizing: border-box;

    &::after {
      @include border-retina(surround, transparent);

      border-color: inherit;
      border-radius: 999px;
    }

    &.unselected {
      color: $gray-icon-color;
      background-color: $white !important;
      border-color: $gray-icon-color !important;
    }
  }

  .desc {
    font-size: 12px;
    line-height: 32px;
    color: $disabled-color;
    text-align: center;
  }

  .empty {
    padding-bottom: 40px;
    font-size: 14px;
    color: $disabled-color;
    text-align: center;

    .empty-icon {
      display: block;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      background: url(/wsc-h5-vis/course/detail/empty.png) no-repeat center / 68px 41px;
    }
  }
}

.write-comment-wrap {
  padding-right: 16px;
  margin-top: 8px;
  text-align: right;
}
</style>
