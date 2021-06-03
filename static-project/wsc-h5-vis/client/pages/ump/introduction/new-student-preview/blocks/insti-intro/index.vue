<template>
  <section-container v-if="constitutionDesc" title="机构介绍">
    <div class="insti-intro">
      <div v-lazy-container="{ selector: '.js-richtext-lazy-img' }" class="insti-intro__content">
        <cap-rich-text :content="constitutionDesc" class="intro" />
      </div>
    </div>
  </section-container>
</template>

<script>
import { RichText } from 'captain-ui';
import SectionContainer from '../../../components/section-container';

export default {
  name: 'insti-intro',

  components: {
    'cap-rich-text': RichText,
    SectionContainer,
  },

  data() {
    return {};
  },

  props: {
    constitutionDesc: {
      type: String,
      default: '',
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../../../new-student/blocks/insti-intro/index.scss';
</style>
