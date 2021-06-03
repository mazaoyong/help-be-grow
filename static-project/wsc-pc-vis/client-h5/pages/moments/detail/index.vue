<template>
  <div class="moments-feed-detail">
    <template v-if="!onLoad">
      <div v-if="hasPostDetail">
        <feed-card
          :key="postDetail.postId"
          :feed="postDetail"
          :media-list="mediaList(postDetail)"
          :show-avatar="true"
          :share-type-options="shareTypeOptions"
          :show-edit-more="postDetail.postId === showEditMoreId"
          avatar="senderAvatar"
          title="senderName"
          content="textContent"
          @on-operate="handleFeedCardOperator"
        />
        <template v-if="!noLikedUsers || hasComments">
          <div class="feeds-card-operator__bottom">
            <div class="trangle-top" />
            <liked-users
              :feed="postDetail"
              :default-avatar="getDefaultAvatar"
              :show-avatar="true"
              @clickLikedUser="clickLikedUser"
            />
            <comments
              :feed="postDetail"
              :default-avatar="getDefaultAvatar"
              :show-avatar="true"
              @createComment="createComment"
              @deleteComment="deleteComment"
              @clickCommentItem="clickCommentItem"
              @clickCommentUser="clickCommentUser"
            />
          </div>
        </template>

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
      <div v-else class="detail-not-exisit">
        <img :src="notExist" alt="不存在该点评.png">
        <p>啊哦~点评已被删除</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Cell, Dialog, List, Popup } from 'vant';
import isEmpty from 'lodash/isEmpty';
import ZNB from '@youzan/znb';
import FeedCard from '@/vis-shared/components/feed-card';
import LikedUsers from '@/vis-shared/components/feed-card/feeds-card-operator/liked-users';
import Comments from '@/vis-shared/components/feed-card/feeds-card-operator/comments';
import get from 'lodash/get';
import CommentInput from '@/vis-shared/views/moments/components/CommentInput.vue';
import * as SafeLink from '@youzan/safe-link';

import apis from './apis';
import constants from './constants';

const kdtId = _global.kdt_id;
ZNB.init({ kdtId: kdtId });

export default {
  name: 'feed-detail',

  components: {
    'feed-card': FeedCard,
    'liked-users': LikedUsers,
    'comments': Comments,
    'van-cell': Cell,
    'van-list': List,
    'van-popup': Popup,
    'comment-input': CommentInput,
  },

  data() {
    return {
      onLoad: true,

      actor: {},

      comment: '',
      showShareAction: false,
      showSharePopup: false,
      title: '立即分享给好友吧',
      content: '点击屏幕右上角将页面分享给好友',
      showCommentEditor: false,
      notExist: constants.STATIC_ASSETS.notExist,
    };
  },

  computed: {
    ...mapState('feeds', ['postDetail', 'showEditMoreId']),
    hasPostDetail() {
      const keys = Object.keys(this.postDetail);

      return keys.length;
    },

    noLikedUsers() {
      return isEmpty(this.postDetail.likedUsers);
    },
    hasComments() {
      return this.postDetail.comments.content.length > 0;
    },
    getDefaultAvatar() {
      return constants.STATIC_ASSETS.userAvatar;
    },
    commentPlaceHolder() {
      return isEmpty(this.actor) ? '评论' : `回复${this.actor.userName}：`;
    },
    shareTypeOptions() {
      return constants.shareTypeOptions;
    },
  },

  mounted() {
    document.addEventListener('click', this.resetEditMore);
    const postId = this.$route.params.postId;
    if (postId !== undefined && postId !== null) {
      this.$store.dispatch('feeds/getPostDetail', {
        postId,
      }).then(() => {
        ZNB.configShare({
          title: '家校圈',
          desc: '家校圈',
          link: `https://www.youzan.com/v4/vis/h5/edu/moments/feeds/detail/${this.postDetail.postId}`,
          imgUrl: 'https://img01.yzcdn.cn/1.jpeg',
        }).catch(() => {});
      }).finally(() => (this.onLoad = false));
    } else {
      throw new Error('找不到该评论详情');
    }
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
          if (videoInfo.coverUrl) {
            videoInfo.coverUrl = videoInfo.coverUrl.replace('img.yzcdn.cn', 'img01.yzcdn.cn');
          }
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
      apis.deleteReview(data).then(res => {
        if (res) {
          this.$store.dispatch('feeds/deleteFeed', { postId }).then(() => {
            this.$router.go(-1);
          });
        }
      }).catch(err => {
        this.$notify({
          message: err,
          duration: 1000,
          background: '#1989fa',
        });
      });
    },

    clickShare(feed) {
      this.showShareAction = true;
    },

    clickShareType(item) {
      this.title = item.popupTitle || this.title;
      this.content = item.popupContent || this.content;
      item.onClick.call(this);
      this.showShareAction = false;
    },

    clickLike(feed) {
      const postId = get(feed, 'postId');
      const isLiked = get(feed, 'isLiked');
      const data = {
        postId,
        interactionType: 1,
        sender: {
          userId: _global.userId,
          userRole: 2,
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
          console.log('createlike res', res);
        }).catch(err => {
          this.$notify({
            message: err,
            duration: 1000,
            background: '#1989fa',
          });
        });
      }
    },

    clickComment(feed) {
      this.showCommentEditor = true;
    },

    clickCommentItem(feed, comment) {
      if (comment.actorId === _global.userId && comment.actorRole === 2) {
        this.deleteComment(comment.interactionId);
      } else {
        this.actor = { userId: comment.actorId, userRole: comment.actorRole, userName: comment.actorName };
        this.clickComment();
      }
    },

    createComment(comment) {
      this.comment = comment;
      const postId = get(this.postDetail, 'postId');

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

    deleteComment(interactionId/* postId, interactionId, sender */) {
      const data = {
        postId: this.postDetail.postId,
        interactionId,
        interactionType: 2,
        sender: { userId: this.postDetail.senderId, userRole: this.postDetail.senderRole },
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
      this.$store.dispatch('feeds/handleEditMoreForDetail', feed);
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
        kdtId: kdtId,
      });
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
/* 解决输入法出现底部白色底凸起的问题 */
html {
  body:after {
    display: block;
    content: '';
    width: 100%;
    height: 0px !important;
    background-color: inherit;
  }
}

.moments-feed-detail {
  height: 100%;
  cursor: pointer;

  .moments-feeds__card {
    padding: 16px 16px 0;
  }

  .feeds-card-operator__bottom {
    position: relative;
    padding-bottom: 0;
    margin: 0 16px;
    overflow: visible;

    &-like {
      padding: 8px;
      border-bottom: 1px solid #EBEDF0;
    }

    &-border {
      border-bottom: 1px;
      border-color: #EBEDF0;
      border-style: solid;
    }
  }

  .detail-not-exisit {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 200px;
    height: 135px;
    margin-top: -67.5px;
    margin-left: -100px;

    img {
      width: 100px;
      height: 100px;
      margin: auto;
      margin-bottom: 15px;
    }

    p {
      display: inline-block;
      font-size: 14px;
      color: #a3a3a3;
      text-align: center;
    }
  }
}

.moments-feeds {
  height: 100%;
  overflow-y: scroll;

  &__add {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 54px;
    height: 54px;
    overflow: hidden;
    background-color: #00B389;
    border-radius: 50%;

    .van-icon {
      display: block;
      font-size: 30px;
      font-weight: bold;
      line-height: 54px;
      text-align: center;
    }
  }

  &__card-container {
    height: calc(100% - 195px);
  }
}

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
