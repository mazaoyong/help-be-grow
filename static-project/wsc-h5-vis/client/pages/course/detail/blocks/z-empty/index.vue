<template>
  <!-- 空模块，用于复制 -->
  <div>
    空模块
  </div>
</template>

<script>
import rootStore from '@/pages/course/detail/store';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  state: [],
  getters: [],
  rootState: [],
  rootGetters: [],
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
</style>
