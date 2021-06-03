<template>
  <preview
    :config="config"
  />
</template>

<script>
import { Toast } from 'vant';
import Args from '@youzan/utils/url/args';
import Preview from '@/vis-shared/views/moments/poster';
import apis from './api';
import {
  // getWechatQrcode,
  getQrcode,
} from '@/pages-api/common';

const postId = Args.get('postId');
const kdtId = _global.kdtId;

export default {

  components: {
    'preview': Preview,
  },
  data() {
    return {
      config: {},
    };
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    this.fetchConfig();
  },

  methods: {
    fetchConfig() {
      apis.findPostDetail({
        postId: postId,
      })
        .then(res => {
          return this.getCode(res)
            .then(base64 => {
              this.config = Object.assign(res, { shareCode: base64 });
            });
        })
        .catch(err => Toast(err));
    },

    getCode(res = {}) {
      const realUrl = `https://h5.youzan.com/wscvis/edu/moments/feeds/detail/${postId}?kdt_id=${res.kdtId || kdtId}&logfrom=3`;
      // 生成小程序码
      // const data = {
      //   page: `/packages/edu/webview/index`,
      //   targetUrl: encodeURIComponent(realUrl),
      // };
      // return apis.getWechatCode(data);

      return getQrcode({ url: realUrl, isShortenUrl: true });
    },
  },
};
</script>

<style lang="scss">
  body {
    background-color: rgb(247, 248, 250);
  }
</style>
