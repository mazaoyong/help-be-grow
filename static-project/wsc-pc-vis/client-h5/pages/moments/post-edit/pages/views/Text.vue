<template>
  <post-text
    :value="$store.state.edit.textContent"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<script>
import Text from '../components/Text';
export default {
  components: {
    'post-text': Text,
  },
  computed: {
    placeholder() {
      const { pageFrom, onlyOneStudent, mentionedUsers } = this.$store.state.edit;
      let str = '';
      if (pageFrom === 1) {
        if (onlyOneStudent) {
          const studentNames = mentionedUsers.map(item => item.name);
          str = `想对${studentNames[0]}说...`;
        } else {
          str = '想对同学们说的...';
        }
      } else {
        str = '想对同学们说的...';
      }

      return str;
    },
  },
  methods: {
    onInput(value) {
      this.$store.commit('edit/SET_CONTENT', value);
    },
  },
};
</script>
