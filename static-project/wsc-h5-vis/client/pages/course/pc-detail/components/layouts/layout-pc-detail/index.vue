<template>
  <div class="pc-detail">
    <layout-header>
      <slot name="header" />
    </layout-header>

    <layout-main>
      <slot name="main" />
    </layout-main>

    <div class="pc-detail__cols">
      <layout-detail>
        <slot name="detail" />
      </layout-detail>

      <layout-aside>
        <slot name="aside" />
      </layout-aside>
    </div>

    <layout-footer>
      <slot name="footer" />
    </layout-footer>
  </div>
</template>

<script>
import LayoutHeader from '../layout-header';
import LayoutMain from '../layout-main';
import LayoutDetail from '../layout-detail';
import LayoutAside from '../layout-aside';
import LayoutFooter from '../layout-footer';

export default {
  name: 'pc-detail',

  components: {
    LayoutHeader,
    LayoutMain,
    LayoutDetail,
    LayoutAside,
    LayoutFooter,
  },
};
</script>

<style lang="scss" scoped>
.pc-detail {
  height: 100%;
  max-width: 1200px;
  min-width: 1200px;
  margin: 0 auto;

  &__cols {
    display: flex;
  }
}
</style>
