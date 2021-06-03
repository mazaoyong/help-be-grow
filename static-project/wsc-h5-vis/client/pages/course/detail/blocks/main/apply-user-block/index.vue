<template>
  <div
    v-if="applyUser"
    v-tab="{ index: 1, title: '详情介绍' }"
    class="apply-user-block"
  >
    <p class="title">
      适用对象
    </p>
    <p class="content">
      {{ applyUser }}
    </p>
  </div>
</template>

<script>
export default {
  rootState: ['goodsData'],

  computed: {
    applyUser() {
      return this.goodsData.applyUser;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.apply-user-block {
  padding: 16px 16px 12px;
  margin-bottom: 8px;
  background-color: $white;

  .title {
    font-size: 14px;
    font-weight: bold;
    line-height: 18px;
    color: $main-text-color;
  }

  .content {
    margin-top: 12px;
    font-size: 13px;
    line-height: 17px;
    color: $vice-text-color;
  }
}
</style>
