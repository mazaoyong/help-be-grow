<template>
  <div class="frineds-avatr">
    <van-img
      v-for="(src, idx) of formatAvatars"
      :key="idx"
      :src="src"
      round
      fit="contain"
      :width="26"
      :height="26"
      class="avatar"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { Image as VanImage } from 'vant';

export default Vue.extend({
  name: 'friends-avatar-list',
  components: {
    'van-img': VanImage,
  },
  props: {
    limit: {
      type: Number,
      default: 5,
    },
    showMore: {
      type: Boolean,
      default: true,
    },
    avatars: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    formatAvatars() {
      const { avatars, limit, showMore } = this;
      if (avatars.length <= limit) {
        return avatars;
      }
      if (showMore) {
        return [
          ...avatars.slice(0, limit - 2),
          'https://b.yzcdn.cn/public_files/9adc5c2f49f3982006b52091d5a0d55b.png',
          avatars[limit - 1],
        ];
      }
      return avatars.slice(0, limit);
    },
  },
});
</script>

<style lang="scss" scoped>
.avatar {
  & + .avatar {
    margin-left: 4px;
  }
}
</style>
