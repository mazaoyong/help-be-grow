<template>
  <div class="header">
    <div class="header-title">
      <img src="https://img01.yzcdn.cn/public_files/2018/05/09/7d9c2473a77a6eab08c70d28da5c9546.png" alt="">
      <p>{{ isShareGift ? count : '' }}{{ textInfo.title }}</p>
      <img src="https://img01.yzcdn.cn/public_files/2018/05/09/c242a6955d01c23e52e624652491e002.png" alt="">
    </div>
    <p class="header-desc">
      {{ textInfo.desc }}
    </p>
  </div>
</template>

<script>
export default {

  name: 'gift-header',

  props: {
    textInfo: Object,
    count: Number,
    isShareGift: Boolean,
  },

  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 330px;
    height: 42px;
    margin-top: 40px;
    color: #c8a06f;

    .header-title {
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        margin: 10px;
        font-size: 17px;
      }

      img {
        width: 70px;
        height: 1px;
      }
    }

    .header-desc {
      font-size: 12px;
    }
  }

</style>
