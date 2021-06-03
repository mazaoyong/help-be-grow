<template>
  <info-tab
    v-show="show"
    :sticky="env.isMobile"
    scrollspy
    @change="change"
  >
    <span
      slot-scope="props"
      v-log="{
        ei: 'click_tab',
        en: '点击tab',
        params: {
          label: props.tab.title
        }
      }"
    >
      {{ tabLength > 2 ? props.tab.title.slice(2, 4) : props.tab.title }}
    </span>
  </info-tab>
</template>

<script>
import InfoTab from '@/pages/course/detail/components/info-tab';

export default {
  components: {
    InfoTab,
  },

  data() {
    return {
      show: false,
      tabLength: 0,
    };
  },

  rootState: ['env'],

  methods: {
    change(tabs) {
      this.tabLength = tabs.length;
      if (tabs.length > 1) {
        this.show = true;
      }
    },
  },
};
</script>
