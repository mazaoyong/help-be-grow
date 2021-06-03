<template>
  <div class="content">
    <p
      v-for="item in list"
      :key="item.tag"
      class="content-item"
      @click="onClick(item)"
    >
      <mini-font-tag
        :text="item.tag"
        :color="mainColor"
        :background-color="backgroundColor"
        class="tag"
        height="14px"
      />
      <span>{{ item.tip }}</span>

      <van-icon
        v-if="item.hasMore"
        name="arrow"
        color="#c8c9cc"
        size="14px"
      />
    </p>
  </div>
</template>

<script>
import { Icon as VanIcon } from 'vant';
import { getThemeColor, fns } from '@youzan/vue-theme-plugin';
import MiniFontTag from '@/components/mini-font-tag';

import { Popup } from '@youzan/vis-ui';
import ExamList from 'supv/examination/modules/course-exam/blocks/ExamList';

const openExamPopup = Popup.getOpenPopup(ExamList, {
  props: {
    title: '购买课程可参加以下考试',
    buttons: [
      {
        text: '完成',
        color: getThemeColor('main'),
        onClick: ctx => { ctx.$emit('resolve'); },
      },
    ],
  },
});

export default {
  components: {
    VanIcon,
    MiniFontTag,
  },

  props: {
    alias: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    mainColor() {
      return this.$theme.colors.main;
    },

    backgroundColor() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },
  },

  methods: {
    onClick(item) {
      if (item.name === 'exam') {
        openExamPopup({
          props: {
            alias: this.alias,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 16px;
  font-size: 12px;

  .content-item {
    margin-bottom: 16px;
    line-height: 18px;

    .van-icon {
      float: right;
      margin-top: 2px;
    }
  }

  .tag {
    padding: 0 2px;
    margin-right: 8px;
  }
}
</style>
