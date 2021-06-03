<template>
  <div class="moments-feeds__cards">
    <van-list
      v-model="fetchingData"
      class="moments-feeds"
      finished-text="没有更多了"
      :error.sync="error"
      :finished="isLastPage"
      :offset="1000"
      @load="handleFecthNextPage"
    >
      <div class="moments-feeds__card-container">
        <!-- 点评列表卡片 -->
        <feed-card
          v-for="(item) in feedList"
          :key="item.postId"
          :feed="item"
          :media-list="mediaList(item)"
          :share-type-options="shareTypeOptions"
          :show-edit-more="item.postId === showEditMoreId"
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
    <!-- 分享浮层 -->
    <share-popup
      :show="showSharePopup"
      @close="showSharePopup = false"
    >
      <template slot="title">
        {{ title }}
      </template>
      <template slot="desc">
        {{ content }}
      </template>
    </share-popup>

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
import { mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import { Cell, Dialog, List, Popup } from 'vant';
import get from 'lodash/get';
import ZNB from '@youzan/znb';
import FeedCard from '@/vis-shared/components/feed-card';
import SharePopup from '@/components/share-mask';
import CommentInput from '@/vis-shared/views/moments/components/CommentInput.vue';
import * as SafeLink from '@youzan/safe-link';

import apis from '../../apis';
import constants from '../../constants';
import { logClickShare } from '../../../log';

const kdtId = _global.kdt_id;
ZNB.init({ kdtId });

export default {
  name: 'feeds',

  components: {
    'feed-card': FeedCard,
    'van-cell': Cell,
    'van-list': List,
    'van-popup': Popup,
    'share-popup': SharePopup,
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
    ...mapState('feeds', [
      'feedList',
      'pageNumber',
      'totalPages',
      'showEditMoreId',
    ]),
    ...mapState('userInfo', ['userId', 'userName', 'avatar', 'userRole']),

    commentPlaceHolder() {
      return isEmpty(this.actor) ? '评论' : `回复${this.actor.userName}：`;
    },
    shareTypeOptions() {
      return constants.shareTypeOptions;
    },
  },

  mounted() {
    document.addEventListener('click', this.resetEditMore);
    this.$store
      .dispatch('feeds/fetchFeedList')
      .finally(() => (this.fetchingData = false));
  },
  destroyed() {
    document.removeEventListener('click', this.resetEditMore);
  },

  methods: {
    hideSharePopup() {
      console.log('hideeee', this.showSharePopup);
      this.showSharePopup = false;
    },
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
          const videoInfo = Object.assign(
            {},
            get(sampleMedia, 'videoDTO', {}),
            {
              source: get(sampleMedia, 'url'),
            },
          );
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
        this.$store
          .dispatch('feeds/fetchFeedList', { pageNumber: this.pageNumber + 1 })
          .then(this.$store.dispatch('feeds/increasePageNumber'))
          .catch(_ => (this.error = true))
          .finally(() => (this.fetchingData = false));
      } else {
        // 获取下一页，如果下一页没有内容就说明是最后一页
        this.$store
          .dispatch('feeds/fetchFeedList', { pageNumber: this.pageNumber + 1 })
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
      SafeLink.redirect({
        url: `/wscvis/edu/moments/post-edit?postId=${postId}&kdt_id=${_global.kdt_id}&redirectUrl=${encodeURIComponent(window.location.href)}`,
        kdtId: _global.kdt_id,
      });
    },
    handleDelete(feed) {
      const postId = get(feed, 'postId');
      const data = {
        postId,
        kdtId: kdtId,
      };

      Dialog.confirm({
        message: '确定删除吗？',
        confirmButtonText: '删除',
        confirmButtonColor: '#00B389',
      }).then(() => {
        apis
          .deleteReview(data)
          .then(res => {
            if (res) {
              this.$store.dispatch('feeds/deleteFeed', { postId });
            }
          })
          .catch(err => {
            this.$notify({
              message: err,
              duration: 1000,
              background: '#1989fa',
            });
          });
      });
    },

    clickShare(feed = {}) {
      this.currentPost = feed;
      this.showShareAction = true;

      logClickShare({
        reviewedNum: get(feed, 'mentionedUsers', []).length,
        imageNum: get(feed, 'extraContents', []).length,
        videoNum: get(feed, 'extraContents', []).length,
        postId: get(feed, 'postId'),
        data: feed,
      });
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
          userRole: 0,
          userName: this.userName,
        },
      };
      if (isLiked) {
        this.$store.dispatch('feeds/deleteLike', data).catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        });
      } else {
        this.$store.dispatch('feeds/createLike', data).catch(err => {
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
    },

    clickCommentItem(feed, comment) {
      this.currentPost = feed;
      if (
        comment.actorId === this.userId &&
        comment.actorRole === this.userRole
      ) {
        this.deleteComment(comment.interactionId);
      } else {
        this.actor = {
          userId: comment.actorId,
          userRole: comment.actorRole,
          userName: comment.actorName,
        };
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
          userId: this.userId,
          userRole: 0,
        },
        replyContent: this.comment,
      };
      if (this.actor) {
        data.receiver = this.actor;
      }
      this.$store
        .dispatch('feeds/createComment', data)
        .catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        })
        .finally(() => {
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
          userId: this.userId,
          userRole: 0,
        },
      };
      Dialog.confirm({
        message: '删除我的评论',
        confirmButtonText: '删除',
        confirmButtonColor: '#00B389',
      }).then(() => {
        this.$store.dispatch('feeds/deleteComment', data).catch(err => {
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
      const title = (function() {
        if (feed.mentionedUsers) {
          return `快来围观${
            feed.mentionedUsers.length > 1
              ? '同学们'
              : feed.mentionedUsers[0].userName
          }的精彩表现吧`;
        } else {
          return '快来围观精彩表现吧';
        }
      })();
      ZNB.configShare({
        title,
        desc: `来自${feed.senderName}的点评`,
        link: `${_global.url.h5}/wscvis/edu/moments/feeds/detail/${feed.postId}?kdt_id=${feed.kdtId}&logfrom=2`,
        imgUrl: this.avatar,
      }).catch(() => {});

      this.$store.dispatch('feeds/handleEditMore', { postId }).catch(err => {
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

    jumpTimeline(item) {
      const senderId = get(item, 'senderId');
      const senderRole = get(item, 'senderRole');
      SafeLink.redirect({
        url: `/wscvis/edu/moments/timeline?kdt_id=${kdtId}&userId=${senderId}&userRole=${senderRole}`,
        kdtId: kdtId,
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
.container {
  cursor: pointer;
}

.moments-feeds__card-container {
  line-height: 20px;
}

.van-dialog__confirm {
  color: #00b389;
}
.van-dialog__message {
  font-size: 16px;
}
.popup-list {
  text-align: center;
}
</style>
