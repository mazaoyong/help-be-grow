<template>
  <div class="moments-post-edit">
    <notice-view />

    <post-text
      class="moments-post-edit-text"
    />

    <media-view
      class="moments-post-edit-media"
    />

    <submit-view />
  </div>
</template>

<script>
import PostText from './pages/views/Text';
import MediaView from './pages/views/Media';
import SubmitView from './pages/views/Submit';
import NoticeView from './pages/views/Notice';

export default {
  name: 'post-edit',

  components: {
    'post-text': PostText,
    'media-view': MediaView,
    'submit-view': SubmitView,
    'notice-view': NoticeView,
  },

  data() {
    return {

    };
  },

  mounted() {
    this.getPost();
    this.getCeresConfig();
  },

  methods: {
    getPost() {
      if (!this.$store.state.edit.isNew) {
        this.$store.dispatch('edit/getFromData');
      }
    },
    getCeresConfig() {
      if (!this.$store.state.edit.ceresConfig) {
        this.$store.dispatch('edit/getCeresConfig');
      }
    },
  },
};
</script>

<style lang="scss">
  .moments-post-edit {
    padding-bottom: 55px;

    .moments-post-edit-text {
      margin: 16px 32px 0;
    }

    .moments-post-edit-media {
      margin: 0 32px;
      padding: 16px 0;
    }

    .moments-post-edit-actions {
      margin: 0 32px;
    }
  }
  body {
    background-color: white;
  }
</style>
