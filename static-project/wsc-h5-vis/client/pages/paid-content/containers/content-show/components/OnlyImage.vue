<template>
  <detail-cover :cover-url="contentData.cover" />
</template>

<script>
import DetailCover from 'pct/components/DetailCover';

export default {
  name: 'only-image',

  components: {
    DetailCover,
  },

  props: {
    contentData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
