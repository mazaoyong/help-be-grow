<template>
  <spread
    :is-show-arrow="isShowArrow"
    @toggle="onToggle"
  >
    <div class="header">
      <span class="left">线索标签</span>
      <a
        href="javascript: void(0);"
        class="right"
        @click="onEdit"
      >
        编辑
      </a>
    </div>
    <div class="body" :style="bodyStyle">
      <div v-if="tags.length > 0" ref="tags">
        <van-tag
          v-for="(tag, index) in tags"
          :key="index"
          color="#323233"
          :class="{
            'system-tag': tag.systemTag
          }"
          :text-color="tag.systemTag ? '#969799' : '#646566'"
          plain
        >
          {{ tag.name }}
        </van-tag>
      </div>
      <div
        v-else
        class="no-tags"
      >
        暂无标签
      </div>
    </div>
  </spread>
</template>

<script>
import { Tag } from 'vant';
import router from '../router.js';
import Spread from '../components/spread.vue'; // 折叠面板组件

const initBodyStyle = { // 初始化折叠的max-height
  maxHeight: '63px',
};

export default {
  name: 'clue-tag',
  components: {
    'spread': Spread,
    'van-tag': Tag,
  },
  props: {
    clueId: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      bodyStyle: initBodyStyle,
      isShowArrow: false,
    };
  },
  mounted() {
    const height = this.$refs.tags && this.$refs.tags.getBoundingClientRect().height;
    if (height > 63) {
      this.isShowArrow = true;
    }
  },
  methods: {
    onEdit() {
      router.push({ name: 'edit-tag', query: { clueId: this.clueId } });
    },
    onToggle(bool) { // bool -> true 折叠; bool - false 展开
      if (bool) {
        this.bodyStyle = initBodyStyle;
      } else {
        this.bodyStyle = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 12px 15px;
  height: 46px;
  border-bottom: 1px solid #f2f2f2;
  clear: both;
  .left {
    display: block;
    float: left;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    font-weight: bold;
    color: #323233;
  }
  .right {
    display: block;
    float: right;
    height: 22px;
    line-height: 22px;
    font-size: 13px;
    color: #646566;
  }
}
.body {
  padding: 5px 10px;
  overflow: hidden;
  min-height: 35px;
  .van-tag {
    margin:  5px;
    height: 18px;
    line-height: 18px;
    padding: 0 4px;
    font-size: 12px;
  }
  .system-tag{
    background: #F7F8FA;
    color: #969799;
    border-color: #DCDEE0;
  }
  .no-tags {
    margin: 10px auto 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #999;
    text-align: center;
  }
}
</style>
