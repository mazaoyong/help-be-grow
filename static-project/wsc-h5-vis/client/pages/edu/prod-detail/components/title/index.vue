<template>
  <div class="vis-title">
    <vis-tag
      v-if="courseTypeName"
      extend-class="vis-tag-theme"
    >
      {{ courseTypeName }}
    </vis-tag>
    <span class="title">{{ title }}</span>
    <share-btn :url="shareUrl" />
  </div>
</template>

<script>
import Tag from 'components/tag';
import ShareBtn from 'pct/components/ShareBtn';

export default {
  name: 'vis-title',
  components: {
    'vis-tag': Tag,
    ShareBtn,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    courseTypeName: {
      type: String,
      default: '',
    },
    alias: {
      type: String,
      default: '',
    },
  },
  computed: {
    shareUrl() {
      const kdtId = window._global.kdt_id;
      return `/wscvis/ump/invite-card?alias=${this.alias}&kdt_id=${kdtId}&owlType=10`;
    },
  },
};
</script>

<style lang="scss">
.vis-title {
  overflow: hidden;
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  text-align: justify;
  line-height: 26px;
  text-overflow: ellipsis;
  display: -webkit-box;
  position: relative;
  margin: 0 -15px;
  padding: 0 60px 0 16px;

  .title {
    vertical-align: top;
    line-height: 22px;
  }

  .vis-tag {
    padding: 4px 5px;
    line-height: 14px;
    font-size: 12px;
    font-weight: normal;
    border-radius: 999px;
    margin-right: 0;
    transform: scale(.83);
    transform-origin: left;
  }
}

.vis-tag-theme {
  flex: 0 0 auto;
}
</style>
