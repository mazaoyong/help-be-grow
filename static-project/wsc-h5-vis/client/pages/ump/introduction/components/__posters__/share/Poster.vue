<template>
  <div class="share">
    <img class='bg' :src="img" />
    <section class="header">
      <img class="avatar" :src="avatar" alt="">
      <span class="name">{{ name }} 邀请你</span>
    </section>
  </div>
</template>

<script>
export default {

  props: {
    avatar: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    img: {
      type: String,
      default: '',
    },
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.share {
  width: 250px;
  height: 200px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  .header {
    background: #ffffff;
    position: absolute;
    left: 8px;
    top: 16px;
    display: flex;
    align-items: center;
    border-radius: 16px;
    padding: 4px 8px 4px 4px;
    box-sizing: border-box;
    .avatar {
      height: 24px;
      width: 24px;
      border-radius: 50%;
    }
    .name {
      font-size: 14px;
      color: #323233;
      line-height: 100%;
      font-weight: 500;
      margin-left: 4px;
    }
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
