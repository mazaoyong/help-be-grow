<template>
  <layout-zan id="app">
    <block-progress slot="progress" />
    <block-records slot="records" />
  </layout-zan>
</template>

<script>
import LayoutZan from '../LayoutZan';
import BlockProgress from '../../blocks/Progress';
import BlockRecords from '../../blocks/Records';

export default {
  name: 'collect-zan',

  components: {
    LayoutZan,
    BlockProgress,
    BlockRecords,
  },
};
</script>
