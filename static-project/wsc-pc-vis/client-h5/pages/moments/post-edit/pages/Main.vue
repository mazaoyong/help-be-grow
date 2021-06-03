<template>
  <div class="moments-post-edit">
    <notice-view />

    <post-text
      class="moments-post-edit-text"
    />

    <media-view
      class="moments-post-edit-media"
    />

    <actions-view
      class="moments-post-edit-actions"
    />

    <submit-view />
  </div>
</template>

<script>
import PostText from './views/Text';
import ActionsView from './views/Actions';
import MediaView from './views/Media';
import SubmitView from './views/Submit';
import NoticeView from './views/Notice';

export default {
  name: 'post-edit',

  components: {
    'post-text': PostText,
    'actions-view': ActionsView,
    'media-view': MediaView,
    'submit-view': SubmitView,
    'notice-view': NoticeView,
  },

  data() {
    return {

    };
  },

  created() {
    console.log('Main create');

    this.setSessionStudent();

    window.addEventListener('visibilitychange', function(e) {
      // const message = '你的修改还未保存，返回后将会丢失';
      // e = e || window.event;

      // if (e) {
      //   e.returnValue = message;
      // }

      // return message;

      // if (document.visibilityState === 'hidden') {
      //   // 资源销毁代码
      //   alert('ss');
      // }
    });

    // pushHistory();
    // var bool = false;
    // setTimeout(function() {
    //   bool = true;
    // }, 1500);
    // window.addEventListener('popstate', function(e) {
    //   if (bool) {
    //     alert('我监听到了浏览器的返回按钮事件啦');// 根据自己的需求实现自己的功能
    //     history.go(-1);
    //   }
    //   pushHistory();
    // }, false);

    // function pushHistory() {
    //   var state = {
    //     title: 'title',
    //     url: '#',
    //   };
    //   window.history.pushState(state, 'title', '#');
    // }
  },

  mounted() {
    this.getPost();
  },

  methods: {
    setSessionStudent() {
      const { canUseSessionStudent } = this.$store.state.edit;
      console.log('setSessionStudent state', this.$store.state.edit);

      let use = false;
      if (canUseSessionStudent) {
        use = true;
      }
      if (use) {
        this.$store.commit('edit/SET_MEMTIONED_USER_BY_SESSION');
      }
    },

    getPost() {
      const { isNew } = this.$store.state.edit;
      if (!isNew) {
        this.$store.dispatch('edit/getFromData');
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
    }

    .moments-post-edit-actions {
      margin: 0 32px;
    }
  }
</style>
