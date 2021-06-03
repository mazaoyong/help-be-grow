<template>
  <div class="error-container">
    <p class="desc">
      系统支付结果确认中，请稍等<br>点击刷新再试一次吧
    </p>

    <section class="actions">
      <a
        @click="onReload"
        class="actions-btn"
        href="javascript:;"
      >
        刷新
      </a>
    </section>
  </div>
</template>

<script>
export default {
  name: 'group-error',

  methods: {
    onReload() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.error-container {
  padding-top: 245px;
  min-height: 100vh;
  background: url(https://b.yzcdn.cn/v2/image/wap/ump/group_tuan/empty_box@2x.png) no-repeat center;
  background-size: auto 200px;
  background-position: center 30px;

  .desc {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
    color: #999;
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
