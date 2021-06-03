<template>
  <content-list
    has-content
    visible
    @setTotal="handleTotalChange"
  />
</template>
<script>
import ContentList from '../content-list';
export default {
  name: 'fallback-list',
  components: { ContentList },
  methods: {
    handleTotalChange(total) {
      this.$emit('onTotalChange', total);
    },
  },
};
</script>
