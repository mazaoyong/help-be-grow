<template>
  <div class="exam-invalid">
    <empty
      message="考试已失效"
      button-text="去逛逛店铺"
      @click="goHomePage"
    />

    <module name="recommend" type="course" />
  </div>
</template>

<script>
import Empty from 'components/error-message';
import { navigateEnv } from '@/common/utils/env';

export default {
  name: 'exam-invalid',

  components: {
    Empty,
  },

  methods: {
    goHomePage() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.exam-invalid {
  .error-message {
    position: relative;
    top: 0;
    height: 283px;
    padding: 43px 0 60px;
    margin-top: 0;
    background: $white;
    transform: none;
    box-sizing: border-box;
  }
}
</style>
