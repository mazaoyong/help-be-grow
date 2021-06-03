<template>
  <div class="block-copyright">
    <p class="copyright">
      © 2012 - {{ year }} <a href="//www.youzan.com">Youzan.com</a>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear() || 2020,
    };
  },
};
</script>

<style lang="scss">
.block-copyright {
  text-align: center;

  .copyright {
    margin: 24px 0;
    font-size: 12px;
    line-height: 18px;
    color: #969799;

    a {
      color: #969799;
    }
  }
}
</style>
