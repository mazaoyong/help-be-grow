<template>
  <div class="copy-content">
    <p>复制地址后，在电脑中使用浏览器打开该地址即可观看直播。</p>
    <br>
    <p>
      地址：<span id="copyTarget">{{ url }}</span>
    </p>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { getShortenUrl } from '../apis';

export default {
  name: 'copy-content',

  data() {
    return {
      url: window.location.href,
    };
  },

  created() {
    getShortenUrl({
      url: window.location.href,
    })
      .then(res => {
        if (res) {
          this.url = res;
        } else {
          Toast('获取短链失败');
        }
      })
      .catch(() => {
        Toast('获取短链失败');
      });
  },
};
</script>

<style lang="scss">
.copy-content {
  margin: 24px;
  overflow: hidden;
  font-size: 14px;
  line-height: 18px;
  color: #323233;
  word-break: break-all;
  user-select: none;

  #copyTarget {
    user-select: auto;
  }
}
</style>
