<template>
  <div class="pc-topbar">
    <div class="pc-topbar__bar">
      <div class="pc-topbar__content">
        <slot />
      </div>
    </div>
    <div class="pc-topbar__placeholder" />
  </div>
</template>

<script>
export default {
  name: 'pc-topbar',
};
</script>

<style lang="scss" scoped>
.pc-topbar {
  &__bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 70px;
    background: #fff;
  }

  &__content {
    display: flex;
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
  }

  &__placeholder {
    width: 100%;
    height: 70px;
  }
}
</style>
