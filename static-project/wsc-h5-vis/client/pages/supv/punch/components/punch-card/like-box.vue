<template>
  <div class="like-box__container">
    <ul class="like-box__like-list">
      <li class="like-box__like-item icon">
        <van-icon name="like-o" style="font-weight: bold;" color="#00b389" />
      </li>
      <li
        v-for="likeItem in likeList"
        :key="likeItem.fansId"
        class="like-box__like-item"
      >
        <span>{{ likeItem.nickname }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { Icon } from 'vant';

export default {
  name: 'like-box',
  components: {
    'van-icon': Icon,
  },
  props: {
    likeList: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>
<style lang="scss" scoped>
.like-box {
  &__container {
    padding: 8px;
    font-size: 14px;
    line-height: 18px;
    color: #646566;
    border-bottom: 1px solid #ebedf0;
    box-sizing: border-box;
  }

  &__like-list {
    display: flex;
    flex-wrap: wrap;
  }

  &__like-item {
    font-weight: normal;
    line-height: 18px;

    &.icon {
      margin-right: 8px;
      transform: translateY(2px);
    }

    &:not(:last-child) span::after {
      position: relative;
      font-size: 14px;
      content: '、';
    }
  }
}
</style>
