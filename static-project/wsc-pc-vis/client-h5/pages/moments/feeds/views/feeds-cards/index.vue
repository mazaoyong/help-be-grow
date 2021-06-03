<template>
  <div class="moments-feeds__cards">
    <van-list
      v-model="fetchingData"
      class="moments-feeds"
      finished-text="没有更多了"
      :error.sync="error"
      :offset="1000"
      :finished="isLastPage"
      @load="handleFecthNextPage"
    >
      <div class="moments-feeds__card-container">
        <!-- 点评列表卡片 -->
        <feed-card
          v-for="item in feedList"
          :key="item.postId"
          :feed="item"
          :media-list="mediaList(item)"
          :show-edit-more="item.postId === showEditMoreId"
          :share-type-options="shareTypeOptions"
          :is-business-type="true"
          avatar="senderAvatar"
          title="senderName"
          content="textContent"
          @on-operate="handleFeedCardOperator"
        />
      </div>
    </van-list>

    <!-- 分享引导 -->
    <van-popup
      v-model="showShareAction"
      class="popup"
      round
      position="bottom"
    >
      <van-list
        class="popup-list"
        finished
      >
        <van-cell
          v-for="(item, index) in shareTypeOptions"
          :key="index"
          class="popup-cell"
          :title="item.text"
          @click="clickShareType(item)"
        />
      </van-list>
    </van-popup>

    <!-- 评论 -->
    <comment-input
      v-model="showCommentEditor"
      :comment="comment"
      :placeholder="commentPlaceHolder"
      @creat="createComment"
      @close="resetCommentEditorStatus"
    />
  </div>
</template>
<script>
import {
  Cell,
  Dialog,
  List,
  Popup,
} from 'vant';
import FeedCard from '@/vis-shared/components/feed-card';

import CommentInput from '@/vis-shared/views/moments/components/CommentInput.vue';

import { mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import ZNB from '@youzan/znb';
import * as SafeLink from '@youzan/safe-link';

import apis from '../../apis';
import * as log from '../../../log';
import constants from '../../constants';

ZNB.init({ kdtId: _global.kdtId });

export default {
  name: 'feeds-cards',
  components: {
    'feed-card': FeedCard,
    'van-cell': Cell,
    'van-list': List,
    'van-popup': Popup,
    'comment-input': CommentInput,
  },

  data() {
    return {
      error: false,
      isLastPage: false,
      fetchingData: true,

      currentPost: {},

      actor: {},
      comment: '',
      showShareAction: false,
      showSharePopup: false,
      title: '立即分享给好友吧',
      content: '点击屏幕右上角将页面分享给好友',
      showCommentEditor: false,
    };
  },
  computed: {
    ...mapState('feeds', ['feedList', 'pageNumber', 'totalPages', 'showEditMoreId']),
    ...mapState('userInfo', ['userName', 'userId', 'userRole']),
    commentPlaceHolder() {
      return isEmpty(this.actor) ? '评论' : `回复${this.actor.userName}：`;
    },
    shareTypeOptions() {
      return constants.shareTypeOptions;
    },
  },

  mounted() {
    document.addEventListener('click', this.resetEditMore);
    this.$store.dispatch('feeds/fetchFeedList').finally(() => (this.fetchingData = false));

    log.logVisitMoment();
  },

  destroyed() {
    document.removeEventListener('click', this.resetEditMore);
  },

  methods: {
    mediaList(item) {
      const extraContents = get(item, 'extraContents', []);
      if (extraContents.length) {
        const sampleMedia = extraContents[0];
        const mediaType = sampleMedia.contentType;
        let list = sampleMedia;
        if (mediaType === 0) {
          // 图片类型
          list = extraContents.map(content => get(content, 'url', ''));
        } else if (mediaType === 2) {
          // 视频
          const videoInfo = Object.assign({}, get(sampleMedia, 'videoDTO', {}), {
            source: get(sampleMedia, 'url'),
          });
          list = [videoInfo];
        }

        return {
          list,
          mediaType,
          hasMedia: true,
        };
      }
      return {
        list: [],
        mediaType: 0,
        hasMedia: false,
      };
    },
    handleFecthNextPage() {
      const canFetch = this.pageNumber < this.totalPages;

      if (canFetch) {
        this.$store.dispatch('feeds/fetchFeedList', { pageNumber: this.pageNumber + 1 })
          .then(this.$store.dispatch('feeds/increasePageNumber'))
          .catch(_ => (this.error = true))
          .finally(() => (this.fetchingData = false));
      } else {
        // 获取下一页，如果下一页没有内容就说明是最后一页
        this.$store.dispatch('feeds/fetchFeedList', { pageNumber: this.pageNumber + 1 })
          .then(list => {
            if (!list.length) {
              this.isLastPage = true;
            }
          })
          .catch(_ => (this.error = true))
          .finally(() => (this.fetchingData = false));
      }
    },
    // operatorCard事件统一处理
    handleFeedCardOperator(type, ...args) {
      const method = get(this, type);
      if (method) {
        method(...args);
      }
    },
    handleEdit(feed) {
      const postId = get(feed, 'postId');
      const kdtId = get(feed, 'kdtId');
      window.location.href = `/v4/vis/h5/edu/moments/post-edit?postId=${postId}&kdtId=${kdtId}&redirectUrl=${encodeURIComponent(window.location.href)}`;
    },
    handleDelete(feed) {
      const postId = get(feed, 'postId');
      const data = {
        postId,
        kdtId: _global.kdtId,
      };
      Dialog.confirm({
        message: '确定删除吗？',
        confirmButtonText: '删除',
        confirmButtonColor: '#00B389',
      }).then(() => {
        apis.deleteReview(data).then(res => {
          if (res) {
            this.$store.dispatch('feeds/deleteFeed', { postId });
          }
        }).catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        });
      });
    },

    clickShare() {
      this.showShareAction = true;
    },

    clickShareType(item) {
      this.title = item.popupTitle || this.title;
      this.content = item.popupContent || this.content;
      item.onClick.call(this);
      this.showShareAction = false;
    },

    clickLike(feed, sender) {
      const postId = get(feed, 'postId');
      const isLiked = get(feed, 'isLiked');

      const data = {
        postId,
        interactionType: 1,
        sender: {
          userId: this.userId,
          userRole: 2,
          userName: this.userName,
        },
      };
      if (isLiked) {
        this.$store.dispatch('feeds/deleteLike', data).then(res => {
          console.log('deletelike res', res);
        }).catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        });
      } else {
        this.$store.dispatch('feeds/createLike', data).then(res => {
          console.log('createlike res', res, this.feedList);
        }).catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        });
      }
    },

    clickComment() {
      this.showCommentEditor = true;
      this.$nextTick(() => {
        // this.$refs.searchVm.focus();
      });
    },

    clickCommentItem(feed, comment) {
      this.currentPost = feed;
      if (comment.actorId === this.userId && comment.actorRole === this.userRole) {
        this.deleteComment(comment.interactionId);
      } else {
        this.actor = { userId: comment.actorId, userRole: comment.actorRole, userName: comment.actorName };
        this.clickComment();
      }
    },

    createComment(comment) {
      this.comment = comment;
      const postId = get(this.currentPost, 'postId');

      const data = {
        postId,
        interactionType: 2,
        sender: {
          userId: _global.userId,
          userRole: 2,
        },
        replyContent: this.comment,
      };
      if (this.actor) {
        data.receiver = this.actor;
      }
      this.$store.dispatch('feeds/createComment', data).then(res => {
        console.log('create comment res', res);
      }).catch(err => {
        this.$notify({
          message: err,
          duration: 1000,
          background: '#1989fa',
        });
      }).finally(() => {
        this.resetCommentEditorStatus();
      });
      this.showCommentEditor = false;
    },

    resetCommentEditorStatus() {
      this.actor = Object.create(null);
      this.comment = '';
    },

    deleteComment(interactionId) {
      const postId = get(this.currentPost, 'postId');
      const data = {
        postId,
        interactionId,
        interactionType: 2,
        sender: {
          userId: _global.userId,
          userRole: 2,
        },
      };
      Dialog.confirm({
        message: '删除我的评论',
        confirmButtonText: '删除',
        confirmButtonColor: '#00B389',
      }).then(() => {
        this.$store.dispatch('feeds/deleteComment', data).then(res => {
          console.log('delete comment res', res);
        }).catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        });
      });
    },

    clickEditMore(feed) {
      this.currentPost = feed;
      const postId = get(feed, 'postId');
      ZNB.configShare({
        title: '家校圈',
        desc: '家校圈',
        link: `https://www.youzan.com/v4/vis/h5/edu/moments/feeds/detail/${postId}`,
        imgUrl: 'https://img01.yzcdn.cn/1.jpeg',
      }).catch(() => {});

      this.$store.dispatch('feeds/handleEditMoreForDetail', { postId }).then(res => {
        console.log('handleEditMore in index');
      }).catch(err => {
        this.$notify({
          message: err,
          duration: 1000,
          background: '#1989fa',
        });
      });
    },
    resetEditMore() {
      this.$store.dispatch('feeds/resetEditMore');
    },

    logShare() {
      console.log('logShare');
    },
    logGeneratePoster() {
      console.log('logGeneratePoster');
    },

    jumpTimeline(item) {
      const senderId = get(item, 'senderId');
      const senderRole = get(item, 'senderRole');
      SafeLink.redirect({
        url: `/v4/vis/h5/edu/moments/timeline?userId=${senderId}&userRole=${senderRole}`,
        kdtId: window._global.kdtId,
      });
    },

    clickTitle(item) {
      this.jumpTimeline(item);
    },

    clickAvatar(item) {
      this.jumpTimeline(item);
    },

    clickLikedUser(user) {
      this.jumpTimeline({
        senderId: user.userId,
        senderRole: user.userRole,
      });
    },

    clickCommentUser(user) {
      this.jumpTimeline({
        senderId: user.userId,
        senderRole: user.userRole,
      });
    },
  },
};
</script>

<style lang="scss">
.van-dialog__confirm {
  color: #00B389;
}
.van-dialog__message {
  font-size: 16px;
}

.popup-list {
  text-align: center;
}
</style>
