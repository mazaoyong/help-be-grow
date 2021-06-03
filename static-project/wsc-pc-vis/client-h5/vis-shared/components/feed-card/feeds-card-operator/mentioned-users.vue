<template>
  <div v-if="feed.mentionedUsers" class="feeds-card-operator__stu">
    {{ mentionedUsers }}
  </div>
</template>

<script>
export default {
  name: 'mentioned-users',
  props: {
    feed: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    mentionedUsers() {
      const userNames = this.feed.mentionedUsers.slice(0, 2).map(u => u.userName).join('、');
      if (this.feed.mentionedUsers.length > 2) {
        return `点评了${userNames}等${this.feed.mentionedUsers.length}人`;
      } else {
        return `点评了${userNames}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.feeds-card-operator__stu {
  margin-bottom: 8px;
  color: #969799;
}
</style>
