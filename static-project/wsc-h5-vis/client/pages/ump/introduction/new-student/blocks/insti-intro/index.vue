<template>
  <section-container v-if="introductionInfo.institutionIntro" title="机构介绍">
    <div class="insti-intro">
      <div v-lazy-container="{ selector: '.js-richtext-lazy-img' }" class="insti-intro__content">
        <cap-rich-text :content="introductionInfo.institutionIntro" class="intro" />
      </div>
    </div>
  </section-container>
</template>

<script>
import { mapState } from 'vuex';
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

  computed: {
    ...mapState(['introductionInfo']),
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
