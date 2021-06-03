<template>
  <vis-shared-moments-header
    :user-name="userName"
    :background-image="backgroundImage"
    :user-avatar="userAvatar"
    :can-user-link="false"
    :mounted="headerAjaxed"
    :can-change-bg="false"
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
  }),

  mounted() {
    this.$store.dispatch('userInfo/initUserInfo')
      .then(() => {
        this.headerAjaxed = true;

        document.title = this.userName;
      });
  },
};
</script>

<style lang="scss">
.timeline__header {
  position: relative;
  height: 196px;
  overflow: hidden;

  &-bgCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 180px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &-user {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 70px;
    padding: 0 16px;
    line-height: 70px;

    .name {
      margin-right: 12px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      vertical-align: top;
    }

    .avatar {
      overflow: hidden;
      border-radius: 4px;
    }
  }
}
</style>
