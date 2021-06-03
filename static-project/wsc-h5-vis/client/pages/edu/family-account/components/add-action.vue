<template>
  <div class="family-detail-add-action">
    <van-button
      v-theme.main="'background!important,border-color!important'"
      text="添加家庭帐号"
      color="#00B389"
      icon="plus"
      round
      class="family-detail-add-action__button"
      @click="addFamilyAccount"
    />
    <van-actionsheet
      v-model="showActionSheet"
      class="operate-popup"
      description="你还没学员，添加家庭账号前请先创建学员"
      :actions="actions"
      cancel-text="取消"
      @select="select"
      @cancel="cancel"
    />
  </div>
</template>
<script>
import { Button, ActionSheet } from 'vant';
import * as SafeLink from '@youzan/safe-link';
export default {
  name: 'add-action',

  components: {
    'van-button': Button,
    'van-actionsheet': ActionSheet,
  },

  props: {
    studentList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      showActionSheet: false,
      actions: [
        {
          name: '创建学员',
        },
      ],
    };
  },

  mounted() {
    // 修改footer的样式
    const style = `
      .footer {
        margin-bottom: 76px !important;
      }
    `;
    const styleBlock = document.createElement('style');
    styleBlock.innerHTML = style;
    document.head.append(styleBlock);
  },

  methods: {
    addFamilyAccount() {
      if (!this.studentList.length) {
        this.showActionSheet = true;
      } else {
        this.$emit('show-role');
      }
    },

    select() {
      const { kdt_id: kdtId = 0 } = window._global;
      SafeLink.redirect({
        url: `/wscvis/edu/student-edit.html?from=studentCert&kdt_id=${kdtId}`,
        kdtId,
      });
    },

    cancel() {
      this.showActionSheet = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.family-detail-add-action {
  &__button {
    z-index: 10;
    position: fixed;
    left: 50%;
    bottom: 32px;
    padding: 0;
    width: 160px;
    font-size: 16px;
    transform: translateX(-50%);
  }

  .van-action-sheet__item,
  .van-action-sheet__cancel {
    padding: 0;
  }

  .van-hairline--top::after {
    border-top-width: 0;
  }

  .family-detail-add-action__button {
    .van-icon-plus {
      font-size: inherit;
      font-weight: bold;
    }
  }
}
</style>
