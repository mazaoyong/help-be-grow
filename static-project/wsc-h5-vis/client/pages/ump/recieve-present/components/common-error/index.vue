<template>
  <div class="common-error">
    <img
      class="img"
      src="https://img01.yzcdn.cn/upload_files/2019/12/31/Fsg8VL1j6a4V0_bWXyjCAbaJM-fj.png"
    >
    <p class="desc">
      {{ desc }}
    </p>
    <slot name="button">
      <van-button
        round
        block
        plain
        :color="themeColor"
        type="info"
        class="refresh-btn"
        @click="onClick"
      >
        {{ btnText }}
      </van-button>
    </slot>
  </div>
</template>

<script>
import { Button } from 'vant';

export default {
  name: 'common-error',
  components: {
    [Button.name]: Button,
  },
  props: {
    desc: {
      type: String,
      default: '网络开了一个小差，请刷新试试',
    },
    btnText: {
      type: String,
      default: '刷新',
    },
  },
  data() {
    return {
      themeColor: this.$theme.colors.main,
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.common-error {
  margin-top: 130px;

  .img {
    display: block;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    transform: translate(10px, 0);
  }

  .desc {
    margin: 5px 0 23px;
    font-size: 12px;
    color: #a0a1a3;
    text-align: center;
  }

  .refresh-btn {
    width: 100px;
    height: 30px;
    margin: 0 auto;
    font-size: 12px;
    line-height: 30px;
    background: none;
  }
}
</style>
