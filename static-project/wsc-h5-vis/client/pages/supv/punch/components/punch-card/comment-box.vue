<template>
  <ul class="comment-box__list">
    <li
      v-for="comment in sliceComments"
      :key="comment.commentId"
      :class="`comment-box__item ${comment.type}-type`"
      @click="$emit('comment-it', comment)"
    >
      <span class="comment-box__publisher">{{ comment.publisher }}</span>
      <span v-if="comment.receiverId && comment.receiverId !== comment.publisherId" class="comment-box__receiver">
        <span style="color: #323233;">回复</span>
        {{ comment.receiver }}
      </span>
      <span class="comment-box__content">：{{ comment.content }}</span>
    </li>
    <li v-if="sliceComments.length < commentNumber" class="comment-box__item" @click="$emit('read-all-comment')">
      <strong>查看全部评论</strong>
      <van-icon name="arrow" size="7" />
    </li>
  </ul>
</template>
<script>
import { Icon } from 'vant';

export default {
  name: 'comment-box',
  components: {
    'van-icon': Icon,
  },

  props: {
    commentList: {
      type: Array,
      default: () => ([]),
    },
    commentNumber: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    sliceComments() {
      const displayComments = [];
      const maxTimes = this.commentList.length - 1;
      let studentCommentsCount = 0;
      let currentIndex = 0;
      do {
        const currentComment = this.commentList[currentIndex];
        displayComments.push(currentComment);
        if (currentComment.type === 'student') {
          studentCommentsCount += 1;
        }
        currentIndex += 1;
      } while (studentCommentsCount < 8 && currentIndex <= maxTimes);

      return displayComments;
    },
  },
};
</script>
<style lang="scss">
.comment-box {
  &__list {
    padding: 8px;
    color: #323233;
  }

  &__item {
    margin-top: 4px;
    font-size: 14px;
    line-height: 18px;

    .comment-box__content {
      font-weight: unset;
      word-break: break-all;
    }

    .comment-box__publisher,
    .comment-box__receiver {
      color: #646566;
    }

    &.teacher-type {
      .comment-box__publisher {
        font-weight: bold;
        color: #00b389;
      }
    }

    strong {
      font-weight: bold;
    }

    .van-icon.van-icon-arrow {
      font-weight: bold;
      vertical-align: middle;
      transform: scale(.8); /** 7 * sqrt(2); */
    }
  }
}
</style>
