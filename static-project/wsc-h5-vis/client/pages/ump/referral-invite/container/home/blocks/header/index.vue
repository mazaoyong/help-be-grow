<template>
  <div class="home-header">
    <div class="home-header__link">
      <!-- <a @click="goProfitDetail">我的收益</a> | -->
      <a @click="$emit('show-rule-popup')">规则</a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions(['goProfitDetail']),
  },
};
</script>

<style lang="scss" scoped>
.home-header {
  overflow: hidden;
  position: relative;
  min-height: 150px;

  &__link {
    position: absolute;
    top: 22px;
    right: 13px;
    color: #fff;
    font-size: 14px;
  }

  &__title {
    display: block;
    width: 100%;
    margin-top: 50px;
  }
}
</style>
