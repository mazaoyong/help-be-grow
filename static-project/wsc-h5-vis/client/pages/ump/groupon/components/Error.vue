<template>
  <div class="error-container">
    <no-course :desc="desc">
      <a
        class="btn btn-goShop"
        @click="reload"
      >
        刷新页面
      </a>
    </no-course>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import NoCourse from '../../../edu/components/no-course';

export default {
  name: 'error',

  components: {
    NoCourse,
  },

  computed: {
    ...mapState([
      'waitFlush',
      'alertTitle',
    ]),

    desc() {
      if (this.waitFlush) {
        return '拼团活动生成中，请稍等片刻，刷新页面';
      } else if (this.alertTitle) {
        return this.alertTitle;
      }
      return '';
    },
  },

  methods: {
    reload() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.error-container {
  padding: 128px 0 0;

  .btn {
    padding: 7px 22px;
    border: 1px solid #666;
    border-radius: 22px;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
  }
  .btn-goShop {
    margin-bottom: 54px;
    display: inline-block;
    border: 1px solid #f44;
    color: #f44;
  }
  .actions {
    padding: 0 10px;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;

    &-btn {
      display: block;
      margin-bottom: 10px;
      text-align: center;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      color: #ed5050;
      background-color: transparent;
      border: 1px solid #ed5050;
    }
  }
}
</style>
