<template>
  <div class="error-message">
    <div
      class="error-message__img"
      :style="{ backgroundImage: `url(${resizedImg})` }"
    />
    <div class="error-message__content">
      <slot>
        <template v-if="messageList.length">
          <p v-for="item in messageList" :key="item">
            {{ item }}
          </p>
        </template>
        <p v-else>
          买点其他东西犒劳下自己吧
        </p>
      </slot>

      <slot name="button">
        <van-button
          class="error-message__button--shop"
          :color="$theme.colors.main"
          :text="buttonText || '去逛逛'"
          size="small"
          plain
          round
          @click="onClick"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import fullfillImage from '@youzan/utils/fullfillImage';
import { navigateEnv } from '@/common/utils/env';

export default {
  name: 'error-message',

  components: {
    'van-button': Button,
  },

  props: {
    img: {
      type: String,
      default:
        'https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png',
    },

    message: {
      type: [String, Array],
      default: () => [],
    },

    buttonText: {
      type: String,
      default: '',
    },
  },

  computed: {
    resizedImg() {
      return fullfillImage(this.img, 'middle');
    },

    messageList() {
      return Array.isArray(this.message) ? this.message : [this.message];
    },
  },

  methods: {
    onClick() {
      if (this.buttonText) {
        this.$emit('click');
      } else {
        navigateEnv();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.error-message {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  margin-top: -60px;

  &__img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 100px;
  }

  &__content {
    margin-top: 4px;
    font-size: 14px;
    line-height: 20px;
    color: $disabled-color;
    text-align: center;
  }

  &__button--shop {
    margin-top: 20px;
    padding: 7px 22px;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
    height: 32px;
  }
}
</style>
