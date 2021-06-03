<template>
  <div class="present-card-wrapper">
    <div class="title-desc">
      {{ title }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'goods-card',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.present-card-wrapper {
  border-radius: 6px;
  background-color: #ffffff;
  padding: 12px;
  margin-bottom: 12px;
}
.title-desc {
  margin-bottom: 15px;
  font-family: PingFangSC;
  font-size: 12px;
  color: #969799;
}
</style>
