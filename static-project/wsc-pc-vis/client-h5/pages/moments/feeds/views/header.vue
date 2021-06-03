<template>
  <vis-shared-moments-header
    :user-name="userName"
    :background-image="backgroundImage"
    :user-avatar="userAvatar"
    :link="linkOftimeline"
    token-url="/v4/vis/h5/edu/commom/material/getQiniuAggregateUploadToken.json"
    :mounted="headerAjaxed"
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
    };
  },

  computed: mapState('userInfo', {
    userName: 'userName',
    backgroundImage: state => state.backgroundImage,
    userAvatar: state => state.avatar,
    linkOftimeline: state => `/v4/vis/h5/edu/moments/timeline?userId=${state.userId}&userRole=2`,
  }),

  mounted() {
    this.$store.dispatch('userInfo/initUserInfo')
      .then(() => {
        this.headerAjaxed = true;
      });
  },

  methods: {
    changeImg(img) {
      console.log('更换图片', img);

      this.$store.dispatch('userInfo/updateCover', { coverUrl: img });
    },
  },
};
</script>

<style lang="scss">
</style>
