<template>
  <div class="punch-detail">
    <div class="punch-detail__header">
      <div class="punch-detail__header__title">
        {{ taskName || gciName }}
      </div>
      <div class="punch-detail__header__btn-all" @click="onGoTask">
        查看全文
      </div>
    </div>

    <punch-card
      :gci-id="+gciId"
      :avatar="userInfo.avatarUrl"
      :nick-name="userInfo.nickname"
      :max-content-line="0"
      :content="diary.content"
      :images="diary.images"
      :audio="diary.audios"
      :created-at="diary.createTime"
      :has-like="liked"
      :like-list="likeList"
      :allow-edit="allowEdit"
      :has-comment="commentList.length"
      :comment-list="commentList"
      :show-share="isMine"
      @modify-it="onGoEdit"
      @like-it="onLikeClick"
      @comment-it="onShowComment"
      @show-share="onShowShare"
    />

    <div class="punch-detail__bottom-btn-group">
      <div class="punch-detail__btn-like" @click="onLikeClick">
        <img-wrap src="https://img01.yzcdn.cn/punch/image/like-cartoon@2x.png" />
        {{ liked ? '已' : '' }}点赞
      </div>
      <div class="punch-detail__bottom-btn-group__sep" />
      <div class="punch-detail__btn-comment" @click="onShowComment">
        <img-wrap src="https://img01.yzcdn.cn/punch/image/comment-cartoon@2x.png" />
        评论
      </div>
    </div>

    <comment-popup
      v-model="showCommentPopup"
      :reply-to="replyTo"
      @submit="onSubmitComment"
    />

    <!-- 由 mixin-share-popup 注册 -->
    <share-popup v-model="showSharePopup" :url="shareUrl" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { ImgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import mixinCommentPopup from 'supv/punch/mixins/mixin-comment-popup';
import mixinShare from 'supv/punch/mixins/mixin-share';
import PunchCard from '../components/punch-card';
import {
  UPDATE_LIKED,
} from './store/mutation-types';
import { redirectToIntroduction } from '../utils';

const global = window._global;
const platform = global.platform || '';

export default {
  name: 'punch-detail',

  components: {
    ImgWrap,
    PunchCard,
  },

  mixins: [mixinCommentPopup, mixinShare],

  computed: {
    ...mapState([
      'userInfo',
      'gciId',
      'taskId',
      'alias',
      'diary',
      'likeList',
      'taskName',
      'gciName',
      'liked',
      'shareFansId',
      'shareFansType',
    ]),
    ...mapGetters([
      'commentList',
      'allowEdit',
      'isMine',
    ]),
  },

  created() {
    if (platform !== 'weixin') {
      redirectToIntroduction();
      return;
    }
    this.initState();
  },

  methods: {
    ...mapMutations([
      UPDATE_LIKED,
    ]),
    ...mapActions([
      'fetchDiary',
      'fetchAllLikeList',
      'fetchAllTeacherComments',
      'fetchAllStudentComments',
      'postLike',
    ]),

    async initState() {
      // 1. 获取页面数据
      await this.fetchDiary();
      await this.fetchAllLikeList();
      await this.fetchAllTeacherComments();
      await this.fetchAllStudentComments();
      // 2. 设置分享数据
      setShareData({
        desc: '',
        link: getShareLink(`${_global.url.h5}/wscvis/supv/punch/detail?kdtId=${_global.kdt_id}&alias=${this.alias}&taskId=${this.taskId}&gciId=${this.gciId}&si=${this.shareFansId}&st=${this.shareFansType}`),
        title: `${_global.visBuyer.finalUsername || ''}邀请你参与${this.gciName || this.taskName || ''}`,
        cover: 'https://img01.yzcdn.cn/punch/image/share@2x.png',
      });
    },

    onLikeEmit(liked) {
      this[UPDATE_LIKED](liked);
      this.postLike();
    },

    onLikeClick() {
      this[UPDATE_LIKED](!this.liked);
      this.postLike();
    },

    onGoTask() {
      const kdtId = _global.kdt_id;
      SafeLink.redirect({
        url: buildUrl(
          `/wscvis/supv/punch/task?kdt_id=${kdtId}&alias=${this.alias}&current_date=${this.diary.taskDate}`,
          'h5',
          kdtId,
        ),
        kdtId: kdtId,
      });
    },

    onGoEdit() {
      const kdtId = _global.kdt_id;
      SafeLink.redirect({
        url: buildUrl(
          `/wscvis/supv/punch/edit?kdt_id=${kdtId}&alias=${this.alias}&taskId=${this.taskId}&pt=edit`,
          'h5',
          kdtId,
        ),
        kdtId: kdtId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.punch-detail {
  padding-top: 60px;
  background: #fff;

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    overflow: hidden;
    line-height: 50px;
    background: #fff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
    box-sizing: border-box;
    align-items: center;

    &__title {
      overflow: hidden;
      font-size: 16px;
      font-weight: 700;
      color: #333;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1 1 0;
    }

    &__btn-all {
      height: 24px;
      padding: 0 10px;
      font-size: 11px;
      line-height: 24px;
      color: #fff;
      background: #00b389;
      border-radius: 12px;
      box-sizing: border-box;
      flex: 0 0 auto;
    }
  }

  &__bottom-btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    width: 100%;
    overflow: hidden;
    font-size: 14px;
    line-height: 50px;
    color: #333;
    background: #fff;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
    box-sizing: border-box;
    justify-content: center;
    align-items: center;

    &__sep {
      width: 1px;
      height: 14px;
      background: #d8d8d8;
      flex: 0 0 auto;
    }

    ::v-deep .imgWrap {
      display: inline-block;
      vertical-align: middle;
    }
  }

  &__btn-like {
    flex: 1 1 0;
    text-align: center;

    ::v-deep .imgWrap {
      vertical-align: -3px;
    }

    ::v-deep img {
      width: 21px;
      height: 17px;
      vertical-align: -2px;
    }
  }

  &__btn-comment {
    flex: 1 1 0;
    text-align: center;

    ::v-deep img {
      width: 20px;
      height: 19px;
      vertical-align: -5px;
    }
  }
}
</style>

<style lang="scss">
.punch-detail {
  pre {
    white-space: pre-wrap;
  }
}
</style>
