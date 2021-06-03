<template>
  <section class="family-account-invite-fail">
    <div class="family-account-invite-fail__info">
      <img
        class="img"
        src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
      >
      <p class="desc">
        抱歉，链接失效
      </p>
      <p class="desc">
        请通知对方重新发起邀请
      </p>
    </div>
  </section>
</template>
<script>
export default {
  name: 'family-account-invite-fail',
};
</script>
<style lang="scss">
.family-account-invite-fail {
  &__info {
    text-align: center;

    img {
      margin: 130px auto 5px auto;
      width: 100px;
      height: 100px;
    }

    .desc {
      line-height: 20px;
      font-size: 14px;
      color: #969799;
    }
  }
}
</style>
