<template>
  <vis-shared-moments-header
    :user-name="userName"
    :background-image="backgroundImage"
    :user-avatar="userAvatar"
    :link="linkOftimeline"
    :mounted="headerAjaxed"
    :module-name="moduleName"
    token-url="/wscvis/getQiniuAggregateUploadToken.json"
    @change="changeImg"
  />
</template>
<script>
import { mapState } from 'vuex';
import Header from '@/vis-shared/views/moments/components/Header.vue';

export default {
  name: 'feeds-header',

  components: {
    'vis-shared-moments-header': Header,
  },

  data() {
    return {
      headerAjaxed: false,
      moduleName: '',
    };
  },

  computed: mapState('userInfo', {
    userName: 'userName',
    backgroundImage: state => state.backgroundImage,
    userAvatar: state => state.avatar,
    linkOftimeline: state => `/wscvis/edu/moments/timeline?kdt_id=${_global.kdt_id}&userId=${state.userId}`,
  }),

  watch: {
    '$store.state.userInfo.moduleName'(newValue) {
      this.moduleName = newValue;
    },
  },

  mounted() {
    this.$store.dispatch('userInfo/initUserInfo')
      .then(() => {
        this.headerAjaxed = true;
      });
  },

  methods: {
    changeImg(img) {
      this.$store.dispatch('userInfo/updateCover', { coverUrl: img });
    },
  },
};
</script>

<style lang="scss">
</style>
