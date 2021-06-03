<template>
  <div class="post-edit-submit f-safeArea">
    <div
      :class="{
        'post-edit-submit__button': true,
        'post-edit-submit__button--active': activePublish
      }"
      @click="onClick"
    >
      发布
    </div>
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import { MAX_CONTENT } from '../constants';
import * as log from '../../../log';

export default {
  components: {
    [Button.name]: Button,
  },

  computed: {
    activePublish() {
      const { textContent, videoList, imgList } = this.$store.state.edit;
      if (textContent || videoList.length > 0 || imgList.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    onClick() {
      const { textContent } = this.$store.state.edit;

      log.logSubmitMoment();

      if ((textContent || '').length > MAX_CONTENT) {
        return Toast(`最多${MAX_CONTENT}个文字`);
      }

      if (!this.activePublish) {
        return false;
      }

      this.$store.dispatch('edit/publish');
    },
  },
};
</script>

<style lang="scss">
  .post-edit-submit {
    width: 100%;
    height: 50px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9;

    &__button {
      background-color: #efefef;
      margin: 7px 16px;
      text-align: center;
      height: 36px;
      border-radius: 18px;
      color: #fff;
      line-height: 36px !important;

      &--active {
        background-color: #00b389;
      }
    }
  }
</style>
