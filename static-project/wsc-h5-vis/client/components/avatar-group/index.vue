<template>
  <div class="wrap">
    <div
      v-for="(item, index) in renderList"
      :key="index"
      class="avatar-item"
      :style="avatarSize"
    >
      <img :src="item.profileUrl">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    size: {
      type: String,
      default: '26px',
    },
  },
  computed: {
    renderList: function() {
      if (this.list.length >= 6) {
        const finalList = this.list.slice(0, 5);
        // finalList.splice(3, 0, '……');
        return finalList;
      } else {
        return this.list;
      }
    },
    avatarSize: function() {
      return { width: `${this.size}`, height: `${this.size}` };
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: inline-flex;
  align-items: center;
}
.avatar-item {
  width: 26px;
  height: 26px;
  border-radius: 100%;
  overflow: hidden;

  img {
    width: 100%;
  }
}
.avatar-item + .avatar-item {
  margin-left: 4px;
}
</style>
