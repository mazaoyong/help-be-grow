<template>
  <div
    class="info"
  >
    <div
      v-if="typeof content !== 'string'"
      :class="['placeholder', {
        'placeholder--reply': isReply
      }]"
    >
      {{ loadingText }}
    </div>
    <img
      v-else
      v-lazy="imgUrl"
      class="img"
      :src="imgUrl"
      @click="previewImg(imgUrl)"
    >
  </div>
</template>

<script>

import isPlainObject from 'lodash/isPlainObject';
import { ZNB } from '@youzan/wxsdk';

export default {

  name: 'chat-item-text',

  components: {
  },

  props: {
    content: [String, Object],
    item: Object,
    isReply: Boolean,
  },

  data() {
    return {
      percentage: 0,
      timer: null,
    };
  },

  computed: {
    imgUrl() {
      let url;
      if (isPlainObject(this.content)) {
        url = this.content.content;
      } else if (typeof this.content === 'string') {
        url = this.content;
      } else {
        url = '';
      }
      return url.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn');
    },
    loadingText() {
      if (this.item.isLoading) {
        return `发送中...(${this.percentage}%)`;
      } else if (this.item.isError) {
        return '发送失败';
      }
      return '';
    },
  },

  watch: {
    item(newValue) {
      if (newValue.isLoading) {
        this.startTime();
      }
    },
  },

  created() {
    if (typeof this.content !== 'string') {
      this.startTime();
    }
  },

  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },

  mounted() {
  },

  methods: {
    startTime() {
      this.percentage = 0;
      this.timer = setInterval(() => {
        this.percentage = this.percentage + parseInt(Math.random() * 10);
        if (this.percentage > 78) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    previewImg(url) {
      ZNB.getWx().then(wx => {
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url], // 需要预览的图片http链接列表
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .info {
    max-width: 216px;

    .img {
      width: 100%;
      border-radius: 2px;
    }

    .placeholder {
      width: 216px;
      height: 130px;
      line-height: 130px;
      color: #fff;
      text-align: center;
      background-color: #c6c6c6;
      border-radius: 2px;

      &--reply {
        width: 196px;
      }
    }
  }
</style>
