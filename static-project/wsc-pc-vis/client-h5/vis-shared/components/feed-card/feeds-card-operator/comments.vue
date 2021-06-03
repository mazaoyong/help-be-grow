<template>
  <div v-if="hasComments" class="feeds-card-operator__bottom-comments">
    <!-- feed 详情页：需要展示头像 -->
    <div v-if="showAvatar">
      <div
        v-for="(comment, index) in feed.comments.content"
        :key="index"
        class="comment"
        @click="$emit('clickCommentItem', feed, comment)"
      >
        <van-icon
          style="margin-top: 8px;"
          size="12px"
          color="#576b95"
          :class="index === 0 ? '' : 'hidden'"
          name="pinglun-bold"
        />
        <div class="comment-content-wrapper">
          <span>
            <img-wrap
              width="34px"
              height="34px"
              class="feeds-card-operator__bottom-like-avatar"
              :src="comment.actorAvatar || defaultAvatar"
              :fullfill="'!120x0.jpg'"
              :cover="true"
              @click.native="clickCommentUser('from', comment, $event)"
            />
          </span>
          <div class="comment-content">
            <div class="comment-from">
              <span
                class="comment-name"
                @click="clickCommentUser('from', comment, $event)"
              >{{ comment.actorName }}</span>
              <span style="color: #969799;">{{ formatTime(comment.createdAt) }}</span>
            </div>
            <div class="comment-to">
              <span v-if="comment.replyTo">回复</span>
              <span
                v-if="comment.replyTo"
                class="comment-name"
                @click="clickCommentUser('to', comment, $event)"
              >{{ comment.replyToName }}: </span>
              <span>{{ comment.replyContent }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- feed 流页面：不需要展示头像 -->
    <div v-else>
      <div
        v-for="(comment, index) in feed.comments.content"
        :key="index"
        class="comment-item"
        @click="$emit('clickCommentItem', feed, comment)"
      >
        <span
          class="comment-name"
          @click="clickCommentUser('from', comment, $event)"
        >{{ comment.actorName }}</span>
        <span v-if="comment.replyTo"> 回复 </span>
        <span
          v-if="comment.replyToName"
          class="comment-name"
          @click="clickCommentUser('to', comment, $event)"
        >{{ comment.replyToName }}</span>
        <span>：</span>
        <span class="comment-content">{{ comment.replyContent }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, ImgWrap } from '@youzan/vis-ui';
import { getFeedTime } from './util';

export default {
  name: 'comments',
  components: {
    'van-icon': Icon,
    'img-wrap': ImgWrap,
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
  },

  computed: {
    hasComments() {
      return this.feed.comments.content.length > 0;
    },
  },

  methods: {
    formatTime(time) {
      return getFeedTime(time);
    },

    clickCommentUser(source, comment, $event) {
      $event.stopPropagation();

      const userIdKey = {
        from: 'actorId',
        to: 'replyTo',
      };
      const roleIdKey = {
        from: 'actorRole',
        to: 'replyToRole',
      };

      const userId = comment[userIdKey[source]];
      const roleId = comment[roleIdKey[source]];

      this.$emit('clickCommentUser', {
        userId,
        userRole: roleId,
      });

      return false;
    },
  },
};
</script>

<style lang="scss">
.feeds-card-operator__bottom-comments {
  // padding: 8px 8px 0;
  .comment-item {
    padding: 4px 8px;
    line-height: 18px;

    &:active {
      background-color: #cdd2de;
    }
  }

  .comment-name {
    color: #576b95;
    font-weight: bold;
  }

  .comment-content {
    word-break: break-word;
  }

  .comment {
    display: flex;
    padding: 8px 8px 0;

    &:active {
      background-color: #cdd2de;
    }

    &:last-child {
      .comment-content-wrapper {
        border: 0;
      }
    }

    .comment-content-wrapper {
      display: flex;
      width: 100%;
      padding-bottom: 8px;
      margin-left: 14px;
      border-bottom: 1px solid #EBEDF0;
    }

    .hidden {
      visibility: hidden;
    }

    .van-icon-comment-o {
      display: flex;
      align-items: center;
      color: #576B95;
    }

    .feeds-card-operator__bottom-like-avatar {
      margin: 2px 10px 5px 0;
      border-radius: 2px;
    }

    .comment-content {
      display: inline-flex;
      flex-direction: column;
      width: 100%;
      font-size: 14px;
      line-height: 18px;

      .comment-from {
        display: flex;
        justify-content: space-between;
      }
      .comment-to {

        &-reply {
          width: 50px;
        }
      }
    }
  }
}

</style>
