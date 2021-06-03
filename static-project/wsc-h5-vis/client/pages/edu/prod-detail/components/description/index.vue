<template>
  <div class="vis-description">
    {{ desc }}
  </div>
</template>

<script>
export default {
  name: 'description',

  props: {
    desc: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.vis-description {
  overflow: hidden;
  font-size: 12px;
  line-height: 18px;
  color: #323233;
  letter-spacing: 0;
  text-align: justify;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
