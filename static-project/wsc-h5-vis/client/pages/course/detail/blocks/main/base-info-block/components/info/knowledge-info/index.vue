<template>
  <div v-if="show" class="knowledge-info">
    <info-table />
    <gift />
  </div>
</template>

<script>
import Table from './table';
import Gift from './gift';

export default {
  components: {
    'info-table': Table,
    Gift,
  },

  rootGetters: ['isOnlineCourse'],

  computed: {
    show() {
      if (this.isOnlineCourse) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.knowledge-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
