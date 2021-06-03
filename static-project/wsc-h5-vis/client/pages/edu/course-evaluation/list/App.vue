<template>
  <div class="evaluate-list">
    <div
      v-if="isEmpty"
      class="empty-page"
    >
      <no-course :desc="'暂无评价'" />
    </div>
    <div v-else>
      <evaluation-summary
        :tag-list="evaluationsSummary"
        @tag-change="onTagChange"
      />
      <van-loading
        v-if="isFetching"
        class="fetching"
      />
      <van-list
        v-else
        v-model="isLoading"
        :finished="isFinished"
        class="evaluate-list__list"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <evaluation-item
          v-for="(item, index) in evaluations"
          :key="index"
          :is-login="isLogin"
          :evaluation="item"
          :show-module="showModule"
          :content-style="'fold'"
          :mode="0"
          @login="onLogin"
          @thumb-ok="onThumbOk(item)"
        />
      </van-list>
      <!-- <back-top /> -->
    </div>
  </div>
</template>

<script>
import { List, Loading, Toast } from 'vant';
import queryString from 'zan-utils/url/queryString';
import API from '../../api';
import CommonLogin from 'common/utils/login';
import EvaluationItem from '../../components/evaluation-item';
import NoCourse from '../../components/no-course';
import Summary from './components/Summary';
import { formatEvaluationData } from '../common/utils/formatData';

const _global = window._global;
const query = { ...queryString.parse(window.location.search) };

export default {
  name: 'app',

  components: {
    'van-list': List,
    'van-loading': Loading,
    'evaluation-summary': Summary,
    EvaluationItem,
    NoCourse,
  },

  data() {
    const user = _global.user || {};

    return {
      isEmpty: false,
      page: 1,
      size: 10,
      tagList: [],
      tagAlias: 'all',
      isLoadOk: true,
      isLoading: false,
      isFetching: false,
      isFinished: false,
      evaluations: [],
      isLogin: !!(user && user.has_login),
      alias: query.courseAlias || '',
      evaluationsSummary: [],
      showModule: ['actionBar', 'additionAndReply'],
      error: false,
    };
  },

  created() {
    this.fetchEvaluationCount();
    this.fetchEvaluationList('fetch');
  },

  methods: {
    fetchEvaluationCount() {
      API.getEvaluationCountApi({ courseAlias: this.alias })
        .then((res = {}) => {
          if (res.code === 0) {
            const data = res.data || [];
            const notGoodTags = ['common', 'negative'];
            data.forEach(item => {
              if (notGoodTags.indexOf(item.tagType) === -1) {
                item.tagClass = 'theme-tag';
              }
            });
            this.evaluationsSummary = data;
          }
        });
    },

    fetchEvaluationList(mode = 'fetch') {
      if (mode === 'fetch') {
        this.page = 1;
        this.isFetching = true;
        this.isFinished = false;
        this.evaluations = [];
      } else if (mode === 'load') {
        this.isLoadOk = false;
      }
      const queryData = {
        alias: query.courseAlias,
        pageNumber: this.page,
        pageSize: this.size,
        tagAlias: this.tagAlias,
      };
      API.getEvaluationsApi(queryData).then((res = {}) => {
        if (res.code === 0) {
          const data = res.data.content || [];
          const total = res.data.total || 0;
          const newEvaluations = data.map(item => {
            return formatEvaluationData(item);
          });
          this.evaluations = [...this.evaluations, ...newEvaluations];
          if (this.evaluations.length === 0) {
            this.isEmpty = true;
          } else if (this.evaluations.length >= total) {
            this.isFinished = true;
          } else {
            this.page += 1;
          }

          if (mode === 'fetch') {
            this.isFetching = false;
          } else if (mode === 'load') {
            this.isLoadOk = true;
            this.isLoading = false;
          }
        } else {
          this.handleFetchFailure(res.msg, mode);
        }
      }).catch(msg => {
        this.handleFetchFailure(msg, mode);
      });
    },

    handleFetchFailure(msg, mode) {
      this.error = true;
      Toast(msg || '请求失败');
      if (this.evaluations.length === 0) {
        this.isEmpty = true;
      }
      if (mode === 'fetch') {
        this.isFetching = false;
      } else if (mode === 'load') {
        this.isLoadOk = true;
        this.isLoading = false;
      }
    },

    onTagChange(tagAlias) {
      this.tagAlias = tagAlias;
      this.fetchEvaluationList('fetch');
    },

    onLoad() {
      if (this.isLoadOk) {
        this.fetchEvaluationList('load');
      }
    },

    // 子组件 card 中 thumb ok，通知外部改变状态
    onThumbOk(evaluation) {
      if (evaluation.hasSupported) {
        evaluation.hasSupported = false;
        evaluation.supportCount -= 1;
      } else {
        evaluation.hasSupported = true;
        evaluation.supportCount += 1;
      }
    },

    onLogin() {
      CommonLogin()
        .then(this.handleAfterLogin);
    },

    handleAfterLogin() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss">
.evaluate-list {
  min-height: 100vh;
  position: relative;

  .fetching {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .empty-page {
    margin-top: 50%;
  }
}
</style>
