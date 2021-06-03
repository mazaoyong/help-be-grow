<template>
  <div v-if="showQrcode" class="pc-qrcode">
    <p>手机扫码访问</p>
    <img
      class="preview-qrcode"
      :src="qrcode"
      alt="二维码"
    >
    <a v-if="isAdmin && editUrl" :href="editUrl">
      重新编辑
    </a>
  </div>
</template>

<script>
import { ajax } from '@youzan/vis-ui';

export default {
  name: 'preview',

  props: {
    showQrcode: Boolean,
    editUrl: String,
  },

  data() {
    return {
      qrcode: '',
      isAdmin: window._global.paidcontent && window._global.paidcontent.is_admin,
    };
  },

  created() {
    this.fetchQrcode();
  },

  methods: {
    // TODO FIXME 冗余代码，需梳理后删除
    fetchQrcode() {
      ajax({
        url: '/wscvis/knowledge/qrcode.json',
        data: {
          kdt_id: window._global.kdt_id,
          url: window.location.href,
          isShortenUrl: true,
          deleteWhite: true,
        },
      })
        .then(data => {
          this.qrcode = data;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'var';

.container > div {
  position: relative;
  margin: 0 auto;
  width: 375px;
}

.pc-qrcode {
  position: absolute;
  top: 100px;
  right: -217px;
  width: 155px;
  padding: 15px 12px 23px;
  border: 1px solid $c-gray-light;
  background-color: $c-white;
  box-sizing: content-box;
  color: $c-black;
  text-align: center;

  > p {
    margin-bottom: 15px;
    font-size: 14px;
  }

  > a {
    display: inline-block;
    margin-top: 15px;
    width: 68px;
    height: 30px;
    line-height: 30px;
    border: 1px solid $c-gray-light;
    border-radius: 2px;
    font-size: 12px;
    color: $c-black;
  }

  .preview-qrcode {
    width: 155px;
    height: 155px;
  }
}
</style>
