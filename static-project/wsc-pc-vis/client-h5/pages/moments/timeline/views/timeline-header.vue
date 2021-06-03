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

  methods: {
  },
};
</script>

<style lang="scss">
</style>
