<template>
  <a
    :class="['share-btn', className]"
    :href="url">
    <van-icon name="share" />
    <span>分享</span>
  </a>
</template>

<script>
import { Icon } from 'vant';
export default {
  name: 'share-btn',
  props: {
    className: String,
    url: String,
  },
  components: {
    'van-icon': Icon,
  },
};
</script>

<style lang="scss" module>
.share-btn {
  width: 50px;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top-left-radius: 38px;
  border-bottom-left-radius: 38px;
  background: #f5f5f5;
  color: #969799;
  position: absolute;
  right: 0;
  top: 0;
  font-weight: normal;
  top: 50%;
  margin-top: -12px;

  .van-icon-share {
    font-size: 14px;
  }

  span {
    padding: 0 4px;
  }
}
</style>
