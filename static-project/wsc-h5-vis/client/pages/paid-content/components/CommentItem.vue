<template>
  <div class="comment">
    <div class="comment__avatar">
      <!-- TODO 默认头像 -->
      <img :src="comment.userHeadIcon || 'https://img01.yzcdn.cn/public_files/2018/04/24/defaultAvatar.png'" alt="">
    </div>

    <div class="comment__container">
      <div class="comment__from-user">
        <div class="comment__item-top">
          <span class="comment__username">
            {{ comment.userNickName || '匿名用户' }}
          </span>
          <div
            v-if="showLikeBtn"
            class="comment__like"
            @click="onClickLike(comment.id)"
          >
            <span>{{ comment.praiseNum }}</span>
            <i :class="comment.isPraise ? 'clicked' : ''" />
          </div>
        </div>

        <div class="comment__content">
          {{ comment.productComment }}
        </div>

        <div class="comment__item-bottom">
          <span class="comment__date">
            {{ getDateStr(comment.createAt) }}
          </span>
          <span
            v-if="comment.canDelete"
            class="comment__del"
            @click="onDelComment"
          >
            删除
          </span>
        </div>
      </div>

      <div
        v-if="comment.replyComments && comment.replyComments.length > 0"
        class="comment__from-author"
      >
        <div class="comment__item-top">
          <span class="comment__username">
            作者回复
          </span>
          <!-- <div
            v-if="showLikeBtn"
            @click="onClickLike(comment.replyComments[0].id)"
            class="comment__like">
            <span>{{ comment.replyComments[0].praiseNum }}</span>
            <i :class="comment.replyComments[0].isPraise ? 'clicked' : ''"></i>
          </div> -->
        </div>

        <div class="comment__content">
          {{ comment.replyComments[0].productComment }}
        </div>

        <div class="comment__item-bottom">
          <span class="comment__date">
            {{ getDateStr(comment.replyComments[0].createAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';
import { makeDateTimeStr } from '@youzan/utils/date';
export default {
  name: 'comment-item',

  components: {
  },

  props: {
    commentData: Object,
    showLikeBtn: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      comment: {},
    };
  },

  created() {
    this.comment = this.commentData;
  },

  methods: {
    onDelComment() {
      Dialog.confirm({
        message: '确认删除吗？',
      }).then(() => {
        this.$emit('deleteComment', this.comment);
      }).catch(() => {
        // click cancle

      });
    },
    onClickLike(commentId, currentLikeStatus) {
      this.$emit('likeComment', this.comment.id === commentId ? this.comment : this.comment.replyComments[0]);
    },
    getDateStr(date) {
      if (new Date(date).getFullYear() === new Date().getFullYear()) {
        return makeDateTimeStr(date, 'MM月DD日 HH:mm');
      } else {
        return makeDateTimeStr(date, 'YYYY年MM月DD日 HH:mm');
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
$com-black: #323233;
$com-gray: #969799;

.comment {
  position: relative;
  padding-bottom: 12px;

  &__avatar {
    float: left;
    width: 40px;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }

  &__item-bottom {
    display: flex;
  }

  &__container {
    margin-left: 40px;
  }

  &__username {
    font-size: 14px;
    font-weight: bold;
    color: $com-black;
  }

  &__like {
    display: inline-block;
    float: right;

    span {
      margin-right: 2px;
      font-size: 14px;
      color: #5979a3;
      vertical-align: middle;
    }

    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      background-image: url(data:image/png;base64,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);
      background-repeat: no-repeat;
      background-size: contain;
    }

    i.clicked {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAkCAYAAAD/yagrAAAAAXNSR0IArs4c6QAABFZJREFUWAnVmF1sFFUUgO+52+60a+tiy0Ob+CAk1gdtosSE8EAEE9JYG8Ea0U4XIWDKP4FEYn8guQ+wlRiNCf4ENLpxO9uwSQsFYqMmIsKDURMSisRAQmjACAoBWX46u8xcz53lNrOzu5Pp7rYu87Bn7rnnnPvNuf9LyEPygBfOLnYkoN+/02gS4oeA/++ve9uve/Fz2qzeM1I7kbjdwA3w1QYr/trfvfxfp02+cl7QUG8Uweh6wvkyTnizPQAAjGN5FDjZq/WHztrrnO9WHKCbODdfIZw8k1EPcAk4H/FB5b5o+M0zGXWOQhYoY5yeSw70oV035yTgsHcUgQPhEVBgq8ZCt+yV8Xjcd+hUqocTcwfqFXud8x2AmJxApDpYu/XLd5cmnPWinAG6gcVrbur6AU5Iay7jfDrM8HnwkxcR9rKw2fZhvPrKNX0EM7gkn09uPfyuKL62COu46KynUsE5hxt6UpsqpPBH3yfNJP9xFTs4S8S58o8+PHVIK9LTyaQx2vVePCi5pPTJl/P3m97BFjfLcgGyzjRSc4Z+OD0HfdcX4C9dZqeSxhNjJw4OSYWQVtevYfG6u3ryAuYm60vsxl7ecbxN4Niu8mLrZgOUzo/t7vxF2lhdfy+ZWpmGxHlc5FMKSAvBNLfYUR6MUb4srcRJXC4PkJcZO1YhcSxQTOM8qSgXiT0z6wK5OlfyULEk4SSqkYpykindbJQ8NPFIsOhxKYNNp6TR7S13gMCN6Wyk0Ng+peJP6ZueTEDGpKJcJC5zNwONc8cljwWKUz0uFWUkD+9f+3xK8ligpp8ewP0641AhDf4viTyf2du2QAeZeo0AiBNTWTzYw5q2O/SzHSY9RlHTVKl+iuPiiL1yZt/TuyJm8ix5lGadOSZBGQOzvqH+dTT8dmYBZWtiV4SLeFxsifV0Zq1Ck6DCfO+WVr2+oW4pLldHpfsMynNUIQvlmdbZLn5F9tO177fKxPgfA7hjLc+uLb0GEzMWALrki7B6NV/0jIxKI7EsvPqsX8VhEJG66ZII+Wu14l/kBinazplRCSVO66E+7WOT8w1SV0qJifipKljblu+eZG8rZ0alAQbiWji0kQK8L3WlkpjJ72r8wZe8QIo2J68ibgBjJ4a/b174mji8LHaz81qHy+ChJkVp/4C1T3j18QQqgp05OXy8+YX2BF7aWrwGz2WHvRRr8j+uMtY2uT3msnPqXMeo01iUO3qia3Fo4/ZWwG2AwudPVXauE2t2rthuuimDimBqn7aCm/wrhPXcI/hxHw32h7a5wbjVuU6mfI54O4wSSt/Ar/TUfUBhVzGQgqOgjMoPUHdorcQ0h9xungC0Oxbu3CN9CpVFgYpG1V5tMf6Jdjj73gWcAtmMy9snhcLZ/YoGFcE6dsYWgGF8I26O6eBg4Ox+GzMZSZeL/y0JqMB4a+fgcynDGMV/94I48FcOhFeU460hnbFV7FiV2q89Vnz+HuII/wH4WlEzY9wTywAAAABJRU5ErkJggg==);
    }
  }

  &__content {
    margin: 8px 0;
    font-size: 14px;
    line-height: 20px;
    color: $com-black;
    word-break: break-all;
  }

  &__from-author {
    position: relative;
    padding: 10px 15px;
    margin-top: 10px;
    background-color: #f7f8fa;
    border-radius: 4px;
  }

  &__date {
    font-size: 12px;
    color: $com-gray;
  }

  &__del {
    float: right;
    margin-left: 8px;
    font-size: 12px;
    color: #607fa6;
  }
}
</style>
