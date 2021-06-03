<template>
  <div v-if="data" class="comment-item">
    <img-wrap
      class="avatar"
      :src="data.userHeadIcon"
      fullfill="!small.png"
      error-img="https://b.yzcdn.cn/wsc-h5-vis/course/detail/defaultAvatar.png"
      width="30px"
      height="30px"
    />
    <div class="info">
      <span class="name">{{ data.userNickName || '匿名用户' }}</span>
      <span v-log="['click_like_comment', '点赞留言']" class="like" @click="like">
        {{ data.praiseNum }}
        <van-icon class="like-icon" :name="data.isPraise ? 'like' : 'like-o'" />
      </span>
    </div>
    <p class="content">
      {{ data.productComment }}
    </p>
    <div class="extra">
      <span class="date">{{ getDate(data.createAt) }}</span>
      <span
        v-if="data.canDelete"
        v-log="['click_delete_comment', '删除留言']"
        class="delete"
        @click="onDelete"
      >删除</span>
    </div>
    <div v-if="data.replyComments && data.replyComments.length" class="reply">
      <span class="title">作者回复</span>
      <p class="content">
        {{ data.replyComments[0].productComment }}
      </p>
      <span class="date">{{ getDate(data.replyComments[0].createAt) }}</span>
    </div>
  </div>
</template>

<script>
import { Icon, Dialog, Toast } from 'vant';
import formatDate from '@youzan/utils/date/formatDate';
import { ImgWrap } from '@youzan/vis-ui';
import { changeLikeStatus, deleteComment } from '../../api';

export default {
  components: {
    'van-icon': Icon,
    ImgWrap,
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  rootState: ['goodsData'],

  methods: {
    getDate(date) {
      if (new Date(date).getFullYear() === new Date().getFullYear()) {
        return formatDate(date, 'MM月DD日 HH:mm');
      } else {
        return formatDate(date, 'YYYY年MM月DD日 HH:mm');
      }
    },

    like() {
      this.data.praiseNum += this.data.isPraise ? -1 : 1;
      this.data.isPraise = !this.data.isPraise;
      changeLikeStatus(this.goodsData.alias, this.data.id, Number(!this.isPraise));
    },

    onDelete() {
      Dialog.confirm({
        message: '确认删除吗？',
      }).then(() => {
        deleteComment(this.goodsData.alias, this.data.id)
          .then(res => {
            Toast.success('删除成功');
            this.$emit('delete', this.data.id);
          })
          .catch(() => {
            Toast('删除失败，请稍后再试');
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.comment-item {
  @include clearfix;

  padding: 12px 16px 12px 52px;

  .avatar {
    float: left;
    margin-left: -40px;
    border-radius: 15px;
  }

  .info {
    line-height: 16px;

    .name {
      font-size: 14px;
      font-weight: bold;
      color: $main-text-color;
    }

    .like {
      float: right;
      font-size: 14px;
      color: #5979a3;

      .like-icon {
        vertical-align: -2px;
      }
    }
  }

  .content {
    margin-top: 8px;
    font-size: 14px;
    line-height: 20px;
    color: $main-text-color;
    word-break: break-all;
  }

  .extra {
    margin-top: 8px;
    font-size: 12px;

    .date {
      color: $disabled-color;
    }

    .delete {
      margin-left: 8px;
      color: #5979a3;
    }
  }

  .reply {
    padding: 12px 16px;
    margin-top: 8px;
    font-size: 14px;
    background-color: #f7f8fa;
    border-radius: 4px;

    .title {
      font-weight: bold;
      color: $main-text-color;
    }

    .date {
      display: block;
      margin-top: 8px;
      font-size: 12px;
      color: $disabled-color;
    }
  }
}
</style>
