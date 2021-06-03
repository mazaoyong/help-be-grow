<template>
  <a
    v-if="goodsData.isOwnAsset"
    v-log="['click_write_comment', '点击写留言']"
    :href="writeCommentUrl"
    class="write-comment"
  >
    <van-icon class="write-comment-icon" name="edit" />
    写留言
  </a>
</template>

<script>
import { Icon } from 'vant';

export default {
  components: {
    'van-icon': Icon,
  },

  rootState: ['goodsData'],
  rootGetters: ['isContent', 'isLive'],

  computed: {
    writeCommentUrl() {
      let pageName = '';
      if (this.isContent) {
        pageName = 'ContentShow';
      }
      if (this.isLive) {
        pageName = 'LiveDetail';
      }
      return `/wscvis/knowledge/index#/writecomment?alias=${this.goodsData.alias}&title=${this.goodsData.title}&pageName=${pageName}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.write-comment {
  font-size: 14px;
  color: #5979a3;

  .write-comment-icon {
    font-size: 16px;
    vertical-align: text-bottom;
  }
}
</style>
