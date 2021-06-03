<template>
  <div class="user-info__container">
    <div class="user-info__avatar">
      <img :src="fullfilledImage" alt="用户头像">
    </div>
    <van-icon
      name="play"
      color="#999"
      size="10px"
      class="user-info__arrow-down"
    />
  </div>
</template>
<script>
import fullfillImage from '@youzan/utils/fullfillImage';
import { Icon } from 'vant';

export default {
  name: 'user-info',
  components: {
    'van-icon': Icon,
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
  },
  computed: {
    fullfilledImage() {
      if (this.avatar) {
        return fullfillImage(this.avatar, '!40x40.jpg');
      }
      return '';
    },
  },
};
</script>
<style lang="scss">
.user-info {
  &__container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__avatar {
    width: 34px;
    height: 34px;
    overflow: hidden;
    border-radius: 20px;

    img {
      width: 34px;
      height: 34px;
    }
  }

  &__arrow-down {
    text-align: center;
    transform: rotate(90deg);
  }
}
</style>
