<template>
  <van-action-sheet
    v-model="show"
    cancel-text="取消"
    @cancel="onCancel"
  >
    <div v-if="isLoading" class="vis-change-img__loading">
      <van-loading />
    </div>
    <vis-img-uploader-single
      v-show="!isLoading"
      :value="imgs"
      :max="1"
      :max-size="maxSize"
      :preview-image="false"
      :token-url="tokenUrl"
      :options="{
        mediaAccessType: 1,
        storeType: 2,
        channel: 'owl_ceres_img',
      }"
      :can-max-hidden-input="false"
      class="vis-change-img"
      @change="onChange"
      @finish="onFinish"
      @finish-error="onFinishErr"
      @click.native="onClick"
    >
      <p
        class="vis-change-img__title"
      >
        {{ title }}
      </p>
    </vis-img-uploader-single>
  </van-action-sheet>
</template>

<script>
import { ActionSheet, Loading } from 'vant';
import {
  ImgUploaderSingle,
} from '@youzan/vis-ui';

const MAX_SIZE_IMG = 5 * 1024 * 1024;

export default {

  components: {
    'van-action-sheet': ActionSheet,
    [Loading.name]: Loading,
    'vis-img-uploader-single': ImgUploaderSingle,
  },

  props: {
    title: {
      type: String,
      default: '更换头像',
    },
    callback: {
      type: Function,
      default: () => {},
    },
    tokenUrl: {
      type: String,
      default: '',
    },
    maxSize: {
      type: Number,
      default: MAX_SIZE_IMG,
    },
  },

  data() {
    return {
      show: false,
      isLoading: false,
      imgs: [],
    };
  },

  methods: {
    onCancel() {
      this.show = false;
      this.$emit('input', false);
      this.callback('cancel');
    },

    onClick() {
      this.show = false;
    },

    onChange() {
      this.$emit('change');
    },

    onFinish(res) {
      console.log('onFinish');

      this.imgs = res;

      this.callback('success', res);
    },

    onFinishErr(err) {
      this.callback('error', err);
    },
  },
};
</script>

<style lang="scss">
  .vis-change-img {
    .vis-img-uploader-drag,
    .vis-img-uploader__uploaderWrap-trigger,
    .van-uploader__wrapper,
    .van-uploader__input-wrapper {
      width: 100%;
    }

    &__title {
      width: 100%;
      height: 50px;
      background-color: #fff;
      line-height: 50px;
      text-align: center;
      color: #323233;
      font-size: 16px;
    }

    &__loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 0;
    }
  }
</style>
