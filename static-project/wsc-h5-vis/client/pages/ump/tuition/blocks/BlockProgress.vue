<template>
  <section class="progress-block">
    <progress-bar
      :config="config.phases"
      :progress="config.count"
      :message="message"
      :pop-tip="popTip"
      :not-start="config.notStart"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import ProgressBar from '../components/ProgressBar.vue';
import { mapGetters } from 'vuex';
export default Vue.extend({
  name: 'block-progreess',
  components: {
    ProgressBar,
  },
  computed: {
    ...mapGetters({
      config: 'blockProgressConfig',
      popTip: 'progressBarPopTip',
      message: 'inviteTip',
    }),
  },
});
</script>

<style lang="scss" scoped>
.progress-block{
  /* @TODO: 页面的 padding */
  margin: 12px auto 0;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 8px 6px 16px 16px;
}

</style>
