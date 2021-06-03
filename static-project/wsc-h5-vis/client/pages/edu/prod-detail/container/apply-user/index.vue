<template>
  <div class="vis-apply-user">
    <h1 class="title">
      适用对象
    </h1>
    <p
      v-html="applyUser"
      class="content"
    />
  </div>
</template>

<script>
export default {
  name: 'apply-user',
  props: {
    applyUser: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.vis-apply-user {
  box-sizing: border-box;
  margin-bottom: -4px;
  width: 100%;
  background-color: #fff;
  .title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #323233;
  }
  .content {
    font-size: 13px;
    color: #646566;
    text-align: justify;
    line-height: 17px;
  }
}
</style>
