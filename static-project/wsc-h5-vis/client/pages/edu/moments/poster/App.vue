<template>
  <preview
    :config="config"
  />
</template>

<script>
import { Toast } from 'vant';
import Args from '@youzan/utils/url/args';
import Preview from '@/vis-shared/views/moments/poster';
import { getQr } from '@/common-api/qr-code';
import { getCommonWeappCode } from '@/common-api/utils';
import apis from './api';

const postId = Args.get('postId');
const kdtId = _global.kdt_id;
const miniprogram = _global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;

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
          return this.getCode()
            .then(base64 => {
              this.config = Object.assign(res, { shareCode: base64 });
            });
        })
        .catch(err => Toast(err));
    },

    getCode() {
      const realUrl = `https://h5.youzan.com/wscvis/edu/moments/feeds/detail/${postId}?kdt_id=${kdtId}&logfrom=3`;
      if (isWeapp) {
        // 生成小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(realUrl),
        };
        return getCommonWeappCode(data);
      } else {
        return getQr({ url: realUrl, isShortenUrl: true });
      }
    },
  },
};
</script>

<style lang="scss">
</style>
