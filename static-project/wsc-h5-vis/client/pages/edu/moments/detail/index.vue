<template>
  <div class="moments-feed-detail">
    <template v-if="!onLoad">
      <div v-if="hasPostDetail">
        <feed-card
          :key="postDetail.postId"
          :feed="postDetail"
          :media-list="mediaList(postDetail)"
          :show-avatar="true"
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
      <div v-else class="detail-not-exisit">
        <img :src="notExist" alt="不存在该点评.png">
        <p>啊哦~点评已被删除</p>
      </div>
    </template>
    <!-- 转介绍推广 -->
    <introduce-promotion :share-url="introduceShareUrl" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Cell, Dialog, List, Popup } from 'vant';
import isEmpty from 'lodash/isEmpty';
import ZNB from '@youzan/znb';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { checkAndLogin } from '@/common/utils/login';
import FeedCard from '@/vis-shared/components/feed-card';
import LikedUsers from '@/vis-shared/components/feed-card/feeds-card-operator/liked-users';
import Comments from '@/vis-shared/components/feed-card/feeds-card-operator/comments';
import SharePopup from '@/components/share-mask';
import CommentInput from '@/vis-shared/views/moments/components/CommentInput.vue';
import get from 'lodash/get';
import * as SafeLink from '@youzan/safe-link';
import Args from 'zan-utils/url/args';
import IntroducePromotion from '@/components/introduce-promotion';

import apis from './apis';
import constants from './constants';
import { logClickShare, logVisitMomentDetail } from '../log';

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
    'share-popup': SharePopup,
    'comment-input': CommentInput,
    IntroducePromotion,
  },

  mixins: [mixinVisPage],

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
      // 转介绍分享链接
      introduceShareUrl: Args.add(location.href, { from: 'moments_detail' }),
    };
  },

  computed: {
    ...mapState('feeds', ['postDetail', 'showEditMoreId']),
    ...mapState('userInfo', ['userId', 'userName', 'avatar']),
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
    this.$store.dispatch('userInfo/initUserInfo');

    const postId = this.$route.params.postId;
    if (postId !== undefined && postId !== null) {
      this.$store.dispatch('feeds/getPostDetail', {
        postId,
      }).then(() => {
        const feed = this.postDetail;

        ZNB.configShare({
          title: `快来围观${this.postDetail.mentionedUsers.length > 1 ? '同学们' : this.postDetail.mentionedUsers[0].userName}的精彩表现吧`,
          desc: `来自${this.postDetail.senderName}的点评`,
          link: `${_global.url.h5}/wscvis/edu/moments/feeds/detail/${this.postDetail.postId}?kdt_id=${this.postDetail.kdtId}&logfrom=2`,
          imgUrl: this.avatar,
        }).catch(() => {});

        logVisitMomentDetail({
          reviewedNum: get(feed, 'mentionedUsers', []).length,
          imageNum: get(feed, 'extraContents', []).length,
          videoNum: get(feed, 'extraContents', []).length,
          postId: get(feed, 'postId'),
          data: feed,
        });
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

      SafeLink.redirect({
        url: `/wscvis/edu/moments/post-edit?postId=${postId}&kdt_id=${kdtId}`,
        kdtId,
      });
    },
    handleDelete(feed) {
      const postId = get(feed, 'postId');
      const data = {
        postId,
        kdtId,
      };

      apis.deleteReview(data).then(res => {
        if (res) {
          this.$store.dispatch('feeds/deleteFeed', { postId });
        }
      }).then(() => {
        SafeLink.redirect({
          url: `/wscvis/edu/moments/timeline?kdt_id=${kdtId}`,
          kdtId,
        });
      }).catch(err => {
        this.$notify({
          message: err,
          duration: 1000,
          background: '#1989fa',
        });
      });
    },

    clickShare(feed = {}) {
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

    clickLike(feed) {
      const postId = get(feed, 'postId');
      const isLiked = get(feed, 'isLiked');
      const data = {
        postId,
        interactionType: 1,
      };

      const doClickLike = () => {
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
      };
      checkAndLogin((ticket, userId) => {
        // 需要登录，登录成功后拿到userId
        if (userId) {
          _global.need_ajax_login = false;
          _global.buyer.id = userId;
        }
        doClickLike();
      });
    },

    clickComment(feed) {
      checkAndLogin((ticket, userId) => {
        // 需要登录，登录成功后拿到userId
        if (userId) {
          _global.need_ajax_login = false;
          _global.buyer.id = userId;
        }
        this.showCommentEditor = true;
      });
    },

    clickCommentItem(feed, comment) {
      checkAndLogin((ticket, userId) => {
        // 需要登录，登录成功后拿到userId
        if (userId) {
          _global.need_ajax_login = false;
          _global.buyer.id = userId;
          return;
        }

        if (comment.actorId === _global.buyer.id && comment.actorRole === 0) {
          this.deleteComment(comment.interactionId);
        } else {
          this.actor = { userId: comment.actorId, userRole: comment.actorRole, userName: comment.actorName };
          this.clickComment();
        }
      });
    },

    createComment(comment) {
      this.comment = comment;
      const postId = get(this.postDetail, 'postId');
      const data = {
        postId,
        interactionType: 2,
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
      const postId = get(this.postDetail, 'postId');
      const data = {
        postId,
        interactionId,
        interactionType: 2,
        // sender: { userId: this.postDetail.senderId, userRole: this.postDetail.senderRole },
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
      this.$store.dispatch('feeds/handleEditMore', feed);
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
        url: `/wscvis/edu/moments/timeline?kdt_id=${kdtId}&userId=${senderId}&userRole=${senderRole}`,
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
.container {
  cursor: pointer;
}

.moments-feed-detail {
  line-height: 20px;
  box-sizing: border-box;

  .moments-feeds__card {
    padding: 16px 16px 8px;
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

    .trangle-top {
      position: absolute;
      top: -8px;
      left: 12px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top: 0;
      border-bottom: 8px solid #F2F3F5;
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

  &__card-container {
    height: calc(100% - 195px);
  }
}

.feeds-card-operator__bottom {
  margin: 0 16px;
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
