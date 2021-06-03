<template>
  <div
    v-if="getItemContent"
    class="detail-item"
  >
    <div
      :class="`detail-item__title ${marginTop}`"
    >
      {{ itemTitle }}
    </div>
    <div
      v-if="typeof(itemContent) === 'string'"
      class="detail-item__content"
    >
      {{ itemContent }}
    </div>

    <div
      v-if="typeof(itemContent) === 'object' && itemTitle === '操作人'"
      class="detail-item__content"
    >
      <span
        v-for="(item, index) in itemContent"
        :key="index"
      >{{ item }} </span>
    </div>
    <div
      v-if="typeof(itemContent) === 'object' && itemTitle === '备注'"
      class="detail-item__content"
    >
      <div
        class="detail-item__content-title"
      >
        {{ itemContent[0] }}
      </div>
      <div>{{ itemContent[1] }}</div>
    </div>
  </div>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
export default {
  name: 'detail-item',

  props: {
    itemTitle: {
      type: String,
      default: '',
    },
    itemContent: {
      type: [Array, String],
      default: '',
    },
  },

  computed: {
    // 单独处理备注显示样式
    marginTop() {
      return this.itemTitle === '备注' ? 'margin-top' : '';
    },
    getItemContent() {
      return !isEmpty(this.itemContent);
    },

  },
};
</script>

<style lang="scss" scoped>
.detail-item {
  display: flex;
  padding: 8px 0;
  font-size: 14px;
  color: #323233;
  align-items: center;
  flex-direction: row;
  background-color: #fff;
  justify-content: space-between;
  .margin-top {
    margin-top: -16px;
  }
  &__title {
    color: #969799;
  }
  &__content {
    &-title {
      float: right;
      margin-bottom: 4px;
    }
  }
}
</style>
