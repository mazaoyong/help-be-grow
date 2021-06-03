<template>
  <div class="evaluate-detail">
    <div
      v-if="!evaluation"
      class="empty-page"
    >
      <no-course :desc="'暂无评价'" />
    </div>
    <evaluation-item
      v-if="isLoaded && evaluation"
      :evaluation="evaluation"
      :show-module="showModule"
      :mode="1"
    />
    <div
      v-if="isShowAddBtn"
      class="evaluate-detail__bottom fixed-btn"
    >
      <van-button
        @click="onGoEvaluationAdditional"
        class="evaluate-detail__bottom-additional tag-hollow"
        size="small"
      >
        追加评价
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import queryString from 'zan-utils/url/queryString';
import * as SafeLink from '@youzan/safe-link';
import API from '../../api';
import EvaluationItem from '../../components/evaluation-item';
import NoCourse from '../../components/no-course';
import { formatEvaluationData } from '../common/utils/formatData';

const query = { ...queryString.parse(window.location.search) };
const url = window._global.url.h5;
const kdtId = window._global.kdt_id;

const EVALUATION_STATUS = {
  CANTEVALUATION: 1, // 未评价，不可评价
  UNEVALUATION: 2, // 未评价，可评价
  CANTREVIEW: 3, // 已评价，不可追评
  UNREVIEW: 4, // 已评价，可追评
  COMPLETE: 5, // 已评价，已追评
};

export default {
  name: 'app',

  components: {
    'van-button': Button,
    EvaluationItem,
    NoCourse,
  },

  data() {
    return {
      assetNo: query.assetNo || '',
      nowItem: [],
      evaluation: {},
      isLoaded: false,
      isShowAddBtn: false,
      title: '',
      showModule: ['additionAndReply'],
    };
  },

  created() {
    this.fetchDetail();
  },

  methods: {
    // 获取评价详情
    fetchDetail() {
      const assetNo = this.assetNo;
      API.getEvaluationDetailApi({ assetNo })
        .then((res = {}) => {
          if (res.code === 0) {
            this.title = res.data.title;
            this.isShowAddBtn = res.data.evaluationStatus === EVALUATION_STATUS.UNREVIEW;
            this.evaluation = formatEvaluationData(res.data.evaluationModels || []);
            this.isLoaded = true;
          } else {
            this.handleFetchFailure(res);
          }
        })
        .catch(err => {
          this.handleFetchFailure(err);
        });
    },

    handleFetchFailure(data) {
      Toast(data.msg || '请求错误');
    },

    onGoEvaluationAdditional() {
      const evaluationAlias = this.evaluation.evaluationAlias;
      const title = this.title;
      const assetNo = this.assetNo;
      const reUrl = `${url}/wscvis/edu/evaluation-create?assetNo=${assetNo}&evaluationAlias=${evaluationAlias}&title=${title}&kdt_id=${kdtId}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
.evaluate-detail {
  min-height: 100vh;

  &__bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    box-sizing: border-box;
    padding: 8px 15px;
    background-color: #fff;
    box-shadow: 0 -2px 10px 0 rgba(150, 151, 153, .16);

    &-additional {
      float: right;
      border-radius: 15px;
      width: 88px;
    }
  }
  .empty-page {
    margin-top: 50%;
  }
}
</style>
