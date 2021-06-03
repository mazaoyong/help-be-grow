<template>
  <div class="user">
    <img :src="avatar" class="avatar">
    <div class="info">
      <p class="name">
        {{ name }}
      </p>
      <p class="desc">
        帮我攒学费，你也可以领课程
      </p>
    </div>
  </div>
</template>

<script>
import { DEFAULT_AVATAR, DEFAULT_USERNAME } from '../../../constants';
export default {
  props: {
    avatar: {
      type: String,
      default: DEFAULT_AVATAR,
    },
    name: {
      type: String,
      default: DEFAULT_USERNAME,
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
    width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
  }
  .info {
    margin-left: 14px;
    .name {
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      padding: 0;
    }
    .desc {
      font-size: 13px;
      color: #646566;
      line-height: 19px;
      margin: 0;
      padding: 0;
      margin-top: 3px;
    }
  }
}
</style>
