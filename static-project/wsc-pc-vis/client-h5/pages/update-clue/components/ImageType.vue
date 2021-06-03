<template>
  <section>
    <div :class="`${prefix}-panel panel image-type ${required ? 'van-cell--required' : ''}`">
      <label class="se__field-label van-cell__title">{{ label }}</label>
      <img-uploader
        v-if="value"
        :token-url="tokenUrl"
        :circle-shape="true"
        :can-delete="false"
        :default-images="[value]"
        icon-name="photograph"
        @onChange="handleValueChange"
      />
      <img-uploader
        v-else
        :token-url="tokenUrl"
        :circle-shape="true"
        :can-delete="false"
        icon-name="photograph"
        @onChange="handleValueChange"
      />
      <van-icon class="se-icon" name="arrow" />
    </div>
    <div v-if="errorConf.isError" :class="`${prefix}-panel panel error`">
      <label class="se__field-label van-cell__title" />
      {{ errorConf.errorMsg }}
    </div>
  </section>
</template>
<script>
import Vue from 'vue';
import { Icon, Toast } from 'vant';
import { ImgUploader } from '@youzan/vis-ui';

Vue.use(Toast);

export default {
  name: 'image-type',

  components: {
    'img-uploader': ImgUploader,
    'van-icon': Icon
  },

  props: {
    prefix: {
      type: String,
      default: 'se__field'
    },
    value: {
      type: String,
      default: undefined
    },
    name: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    errorConf: {
      type: Object,
      default: () => ({
        isError: false,
        errorMsg: ''
      })
    }
  },

  data() {
    return {
      tokenUrl: window._global.url.v4 + '/vis/h5/edu/commom/material/getUploadToken.json'
    };
  },

  methods: {
    handleValueChange(files) {
      if (files.length > 0) {
        this.$emit('change', this.name, files[0].attachment_url);
      }
    }
  }
};
</script>
<style lang="postcss">
.se__field-panel.image-type {
  padding: 14px 15px;
  display: flex;

  img {
    width: 36px;
    height: 36px;
    border-radius: 36px;
  }

  .visImgUploader .van-uploader {
    overflow: initial;

    .van-uploader__input {
      width: 240px;
    }
  }

  .van-cell__title {
    max-width: 90px;
    line-height: 36px;
  }

  .van-cell__right-icon {
    line-height: 36px;
  }

  .visImgUploader__uploaderWrap {
    width: 36px;
    height: 36px;

    img {
      border-radius: 100%;
    }
  }

  .se-icon.van-icon-arrow {
    position: absolute;
    right: 15px;
    font-size: 10px;
    transform: scale(0.8);
  }
}
</style>
