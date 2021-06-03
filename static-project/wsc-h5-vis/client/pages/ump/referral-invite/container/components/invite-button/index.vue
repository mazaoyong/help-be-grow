<template>
  <div class="info__button" :style="{width: `${width}`, height: `${height}`, borderRadius: `${borderRadius}`}">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '30px',
    },
    borderRadius: {
      type: String,
      default: '0',
    },
  },
};
</script>
<style lang="scss" scoped>
.info__button {
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-family: Akrobat;
  font-weight: bold;
  background-image: linear-gradient(90deg, #FF7B17 0%, #FF2B00 100%);
}
</style>
