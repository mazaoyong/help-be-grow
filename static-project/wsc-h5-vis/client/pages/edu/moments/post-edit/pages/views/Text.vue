<template>
  <post-text
    :value="$store.state.edit.textContent"
    placeholder="此刻的感悟..."
    @input="onInput"
  />
</template>

<script>
import Text from '../components/Text';
export default {
  components: {
    'post-text': Text,
  },
  methods: {
    onInput(value) {
      this.$store.commit('edit/SET_CONTENT', value);
    },
  },
};
</script>
