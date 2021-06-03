<template>
  <div class="feeds-card-operator">
    <location :feed="feed" />
    <mentioned-users :feed="feed" />
    <operations
      :feed="feed"
      :show-edit-more="showEditMore"
      :share-type-options="shareTypeOptions"

      @handleEdit="$emit('handleEdit')"
      @handleDelete="$emit('handleDelete')"
      @clickEditMore="$emit('clickEditMore')"
      @clickShare="$emit('clickShare')"
      @clickLike="$emit('clickLike')"

      @clickComment="$emit('clickComment')"
      @createComment="createComment"
      @logShare="$emit('logShare')"
      @logGeneratePoster="$emit('logGeneratePoster')"
    />
    <template v-if="(!noLikedUsers || hasComments) && !showAvatar">
      <div class="feeds-card-operator__bottom">
        <div class="trangle-top" />
        <liked-users
          :feed="feed"
          :default-avatar="defaultAvatar"
          :show-avatar="showAvatar"
          @clickLikedUser="(user) => {$emit('clickLikedUser', user)}"
        />
        <div
          v-if="(!noLikedUsers && hasComments)"
          class="feeds-card-operator__bottom-border"
        />
        <comments
          :feed="feed"
          :default-avatar="defaultAvatar"
          :show-avatar="showAvatar"
          @clickCommentItem="(feed, comment) => $emit('clickCommentItem', feed, comment)"
          @clickCommentUser="(user) => {$emit('clickCommentUser', user)}"
        />
      </div>
    </template>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import Location from './location';
import MentionedUsers from './mentioned-users';
import Operations from './operations';
import LikedUsers from './liked-users';
import Comments from './comments';

export default {
  name: 'feeds-card-operator',
  components: {
    'location': Location,
    'mentioned-users': MentionedUsers,
    'operations': Operations,
    'liked-users': LikedUsers,
    'comments': Comments,
  },
  props: {
    feed: {
      type: Object,
      default: () => {},
    },
    defaultAvatar: {
      type: String,
      default: '',
    },
    showAvatar: {
      type: Boolean,
      default: false,
    },
    showEditMore: {
      type: Boolean,
      default: false,
    },
    showCommentEditor: {
      type: Boolean,
      default: false,
    },

    shareTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      actor: null,
      comment: '',
      likeStatus: false,
      showComment: false,
    };
  },
  computed: {
    noLikedUsers() {
      return isEmpty(this.feed.likedUsers);
    },
    hasComments() {
      return this.feed.comments.content.length > 0;
    },
  },
  methods: {
    createComment(feed, comment, actor) {
      this.$emit('createComment', feed, comment, actor);
    },
    deleteComment(interactionId) {
      this.$emit('deleteComment', interactionId);
    },
  },
};
</script>

<style lang="scss">
.feeds-card-operator {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  &__bottom {
    position: relative;
    margin-top: 8px;
    overflow: visible;
    background-color: #f2f2f4;

    .trangle-top {
      position: absolute;
      top: -8px;
      left: 12px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top: 0;
      border-bottom: 8px solid #f2f2f4;
    }

    &-border {
      height: 1px;
      border: 0;
      border-bottom: 1px;
      border-color: #EBEDF0;
      border-style: solid;
    }

    &-comment {
      margin: 5px;
    }
  }

  .popup {
    flex-direction: column;
    border-radius: 12px 12px 0 0;
  }

  .van-icon {
    margin-right: 4px;
  }
}
</style>
