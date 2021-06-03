<template>
  <div id="app-content">
    <router-view />
  </div>
</template>

<script>
import { getShopName } from './api';

export default {
  name: 'app',

  data() {
    return {
      title: '',
      logo: '',
    };
  },

  created() {
    getShopName()
      .then(res => {
        document.title = res.shopName;
        this.logo = res.logo;
        this.title = res.shopName;
      });
  },
};
</script>

<style lang="scss">
body {
  height: auto;
  overflow-x: hidden;
}

body::-webkit-scrollbar {
  display: none;
  overflow: hidden;
}
</style>
