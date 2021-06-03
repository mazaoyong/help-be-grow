<template>
  <div class="notification-item" @click="$emit('clickItem', errorId, notiType)">
    <div
      :class="{
        'notification-item__avatar': true,
        'error-type': new RegExp(/error\-\w+/).test(notiType)
      }"
    >
      <img
        alt="发送者头像"
        :src="avatar"
      >
    </div>
    <div class="notification-item__msg">
      {{ msg }}
    </div>
    <van-icon
      class="notification-item__icon"
      name="arrow"
      color="#969799"
    />
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'notification-item',

  components: {
    'van-icon': Icon,
  },

  props: {
    icon: {
      type: String,
      default: 'fail',
    },
    avatar: {
      type: String,
      default: undefined,
    },
    msg: {
      type: String,
      default: undefined,
    },
    notiType: {
      type: String,
      default: 'message',
    },
    errorId: {
      type: [String, Number],
      default: undefined,
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss">
.notification-item {
  display: flex;
  flex: none;
  flex-direction: row;
  width: 180px;
  height: 40px;
  margin: 0 auto 10px;
  overflow: hidden;
  line-height: 40px;
  background-color: #323233;
  border-radius: 4px;
  user-select: none;

  &__avatar {
    margin: 5px;
    overflow: hidden;
    border-radius: 4px;

    & img {
      display: block;
      width: 30px;
      height: 30px;
    }

    &.error-type img {
      width: 18px;
      height: 18px;
      margin: 6px;
    }
  }

  &__msg {
    flex: 1;
    color: #fff;
    text-align: center;
  }

  &__icon {
    width: 30px;
    padding-right: 6px;
    line-height: 40px;
    text-align: right;
  }
}
</style>
