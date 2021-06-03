<template>
  <div class="vis-buy-tip">
    <div class="title">
      <h1>购买须知</h1>
    </div>
    <div
      v-html="content"
      class="content"
    />
  </div>
</template>

<script>
export default {
  name: 'buy-tip',
  props: {
    tip: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      content: this.tip.replace(/\n/ig, '<br/>'),
    };
  },
};
</script>

<style lang="scss">
.vis-buy-tip {
  .title {
    position: relative;
    height: 1px;
    margin: 10px 0 15px;
    border-bottom: 1px solid #f2f2f2;
    h1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 15px;
      display: inline-block;
      font-size: 10px;
      color: #333;
      line-height: 20px;
      background-color: #fff;
    }
  }
  .content {
    font-size: 10px;
    color: #333;
    line-height: 16px;
    text-align: justify;
  }
}
</style>
