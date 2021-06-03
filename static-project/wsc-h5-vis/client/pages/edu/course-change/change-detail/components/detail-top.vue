<template>
  <div class="detail-top">
    <div class="detail-top__title van-ellipsis">
      {{ changeContent }}
    </div>
    <div
      v-if="changeData"
      class="detail-top__data van-ellipsis"
    >
      <span :class="`detail-top__data-num ${classStyle}`">{{ changeData }}</span> {{ changeUnit }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'detail-top',
  props: {
    changeData: {
      type: String,
      default: '',
    },
    changeUnit: {
      type: String,
      default: '',
    },
    changeContent: {
      type: String,
      default: '',
    },
  },
  computed: {
    classStyle() {
      return parseInt(this.$route.params.operationType) === 3 ? 'class-style' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-top {
  height: 146px;
  display: flex;
  font-size: 16px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  &__title {
    width: 160px;
    font-weight: 500;
    text-align: center;
  }
  &__data {
    width: 172px;
    margin-top: 16px;
    text-align: center;
    &-num {
      font-family: Avenir;
      font-size: 36px;
      font-weight: bold;
      margin-right: 2px;
    }
  }
  .class-style {
    font-size: 26px;
    font-weight: bold;
  }
}
</style>
