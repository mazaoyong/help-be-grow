<template>
  <div id="app-content">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
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

/* 文字分隔符 */

.content-separator {
  border-left: 1px solid;
  margin: 0 4px;
}
</style>
