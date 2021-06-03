<template>
  <div class="write-comment-page">
    <div class="write">
      <van-cell-group v-if="title">
        <van-cell
          :title="title"
          is-link
          @click="jumpToDetail"
        />
      </van-cell-group>

      <div class="write__textarea">
        <textarea
          v-model="newCommentContent"
          maxlength="800"
          rows="6"
          placeholder=" 欢迎发表你的观点"
        />
        <span> {{ newCommentContent.length }}/800 </span>
      </div>
      <div class="write__submit--wrap">
        <van-button
          type="default"
          size="large"
          class="write__submit"
          @click="onClickPublish"
        >
          提交
        </van-button>
      </div>
    </div>

    <div
      v-if="commentList.length > 0"
      class="my-comment"
    >
      <div class="my-comment__title">
        <!-- <i class="my-comment__sideline" /> -->
        <span>我的留言</span>
        <!-- <i class="my-comment__sideline" /> -->
      </div>
      <div class="my-comment__list">
        <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="getCommentList"
        >
          <comment-item
            v-for="comment in commentList"
            :key="comment.id"
            :comment-data="comment"
            :show-like-btn="false"
            @deleteComment="onDeleteComment"
          />
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, List, Button, Cell, CellGroup } from 'vant';
import apis from 'pct/api';
import CommentItem from 'pct/components/CommentItem';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import * as SafeLink from '@youzan/safe-link';
import { checkAndLogin } from '@/common/utils/login';

export default {
  name: 'write-comment',

  config: {
    title: 'this.title',
  },

  components: {
    'van-list': List,
    'van-button': Button,
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    CommentItem,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      title: this.$route.query.title || '',
      contentTitle: '',
      newCommentContent: '',
      commentList: [],
      // 请求相关
      currentPage: 0,
      loading: false,
      finished: false,
      error: false,
    };
  },

  watch: {
    newCommentContent: function(content) {
      if (content.length > 800) {
        Toast('最多只能输入800字哦');
        this.newCommentContent = content.slice(0, 800);
      }
    },
  },

  created() {
    // 未登录，弹出登录框
    checkAndLogin(() => {
      this.getCommentList();
      if (!this.title) {
        this.getContentTitle();
      }
    });
  },

  mounted() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  },

  methods: {
    onClickPublish() {
      if (!this.newCommentContent.trim()) {
        return;
      }
      apis.postComment({
        productComment: this.newCommentContent,
        alias: this.$route.query.alias,
      })
        .then(() => {
          this.newCommentContent = '';
          Toast.success('提交成功');
          this.getCommentList(true);
          this.jumpToDetail();
          // this.$router.go(-1);
        })
        .catch(errMsg => {
          Toast('留言失败，请稍候再试');
        });
    },
    getCommentList(refresh) {
      this.loading = true;
      // 如果刷新，重置状态
      if (refresh) {
        this.currentPage = 0;
        this.finished = false;
      }
      apis.getMyComment({
        alias: this.$route.query.alias,
        pageNum: this.currentPage + 1,
      }, true)
        .then(data => {
          if (refresh) {
            this.commentList = data.list || [];
          } else {
            this.commentList = this.commentList.concat(data.list || []);
          }
          this.currentPage = data.pageNum;
          if (this.commentList.length >= data.totalItems || data.list.length < data.pageSize) {
            this.finished = true;
          }
          this.loading = false;
        })
        .catch(errMsg => {
          Toast('获取留言失败，请稍候再试');
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onDeleteComment(comment) {
      apis.delComment({
        alias: this.$route.query.alias,
        id: comment.id,
      })
        .then(() => {
          Toast.success('删除成功');
          this.commentList = this.commentList.filter(item => item.id !== comment.id);
        })
        .catch(errMsg => {
          Toast('删除失败，请稍候再试');
        });
    },
    getContentTitle() {
      const { pageName, alias } = this.$route.query;
      const getTitle = pageName === 'LiveDetail' ? apis.getLiveDetail : apis.getContent;
      getTitle({ alias }).then((data) => {
        const { title } = data;
        this.title = title;
        document.title = this.title;
      }).catch((err) => {
        console.warn('get content title error', err);
      });
    },
    jumpToDetail() {
      const query = this.$route.query || {};
      const { alias = '', pageName } = query;
      if (alias) {
        SafeLink.redirect({
          url: `/wscvis/knowledge/index?page=${pageName}&alias=${alias}`,
          kdtId: window._global.kdt_id,
        });
        // 为内容详情页添加路由识别
        // this.$router.push({
        //   path: `/${pageName.toLowerCase()}?alias=${alias}`,
        //   query: {
        //     from_page: 'submit',
        //   },
        // });
      }
    },
  },

};
</script>

<style lang="scss">
  @import 'mixins/index.scss';

  .write {

    &__title {
      padding: 10px 20px 0;
      font-size: 16px;
      line-height: 22px;

      @include multi-ellipsis(2);
    }

    .van-cell {
      padding: 11px 15px;
    }

    .van-cell__title {

      span {
        @include multi-ellipsis(1);
      }
    }

    &__textarea {
      position: relative;
      text-align: center;
      margin: 10px 0;
      padding: 10px;
      padding-bottom: 30px;
      height: 160px;
      background: #fff;

      textarea {
        border: 0;
        border-radius: 4px;
        width: 100%;
        height: 140px;
        color: #323233;
        font-size: 14px;
        resize: none;
      }

      span {
        font-size: 14px;
        color: #969799;
        position: absolute;
        bottom: 15px;
        right: 15px;
      }
    }

    &__submit--wrap {
      padding: 0 15px;
    }

    &__submit {
      display: block;
      margin: 15px auto;
      height: 44px;
      line-height: 44px;
      background-color: #00b389;
      color: #fff;
      font-size: 16px;
      border: 0;
      border-radius: 22px;
    }
  }

  .my-comment {
    /* background-color: #fff; */

    &__title {
      text-align: left;
      font-size: 16px;
      color: #4a4a4a;

      /* margin: 25px 15px; */
      margin: 40px 15px 25px;

      /* height: 30px;
      line-height: 30px; */
      font-weight: bold;

      span {
        display: inline-block;

        /* margin: 0 20px; */
      }
    }

    &__sideline {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      width: 30%;

      &::after {
        @include border-retina(top);
      }
    }

    &__list {
      padding: 0 15px;
    }
  }
</style>
