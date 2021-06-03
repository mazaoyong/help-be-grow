<template>
  <div :class="['evaluate-create', isCreate ? '' : 'additional']">
    <div
      v-if="isCreate"
      class="evaluate-create__product"
    >
      <img-wrap
        :width="'70px'"
        :height="'40px'"
        :src="imgUrl"
        :cover="false"
        :fullfill="'!145x145.jpg'"
      />
      <p class="evaluate-create__product-title">
        {{ title }}
      </p>
    </div>
    <evaluate-card
      ref="evaluateCard"
      :is-create="isCreate"
      :theme-color="themeColor"
    />
    <van-button
      @click="onSubmit"
      class="evaluate-create__submit-btn main-btn fixed-btn"
    >
      提交
    </van-button>
  </div>
</template>

<script>
import { Toast, Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import queryString from 'zan-utils/url/queryString';
import * as SafeLink from '@youzan/safe-link';
import api from '../../api';
import EvaluateCard from './components/EvaluateCard';
import { themeColor } from 'common/constants';

const query = { ...queryString.parse(window.location.search) };
const url = window._global.url.h5;
const globalTheme = window._global.globalTheme;
const kdtId = window._global.kdt_id;

export default {
  name: 'app',

  components: {
    'van-button': Button,
    'img-wrap': ImgWrap,
    EvaluateCard,
  },

  data() {
    return {
      isPosting: false,
      isSuccessed: false,
      title: query.title || '',
      imgUrl: query.imgUrl || '',
      assetNo: query.assetNo || '',
      evaluationAlias: query.evaluationAlias || '',
      isCreate: !query.evaluationAlias,
      themeColor: '',
    };
  },

  mounted() {
    this.themeColor = themeColor[globalTheme];
    document.title = this.isCreate ? this.title || '创建评价' : '追加评价';
  },

  methods: {
    // 检查待提交的数据
    checkQueryData(queryData) {
      // 校验字数是否超出限制
      const { evaluation } = queryData;
      if (!evaluation) {
        Toast('请输入评价内容');
        return false;
      } else if (evaluation.length > 512) {
        Toast('字数限制512字');
        return false;
      }
      return true;
    },

    // 提交评价
    onSubmit() {
      if (this.isSuccessed || this.isPosting) { return; }
      const courseEvaluations = this.$refs.evaluateCard.getEvaluation();
      if (!courseEvaluations.pictures) { // 有图片正在上传
        Toast('有图片正在上传');
        return;
      }

      // 生成提交请求内容
      let queryData = Object.assign({ assetNo: query.assetNo }, courseEvaluations);

      if (this.evaluationAlias) {
        queryData = Object.assign({ evaluationAlias: this.evaluationAlias }, queryData);
      }

      // 提交内容校验
      if (!this.checkQueryData(queryData)) {
        return;
      }

      this.isPosting = true;
      // 有评价alias时为追评
      (this.evaluationAlias ? api.createEvaluationAdditionApi(queryData) : api.createEvaluationApi(queryData))
        .then((res = {}) => {
          if (res.code === 0) {
            this.isPosting = false;
            this.isSuccessed = true;
            this.handleCreateSuccess();
          } else {
            this.handleCreateFail(res);
          }
        }).catch(e => {
          this.handleCreateFail(e);
        });
    },

    // 处理追评成功后的逻辑
    handleCreateSuccess() {
      Toast.success('评价成功');
      // 重定向到查看评价页面
      this.redirectToDetailPage();
    },

    // 处理追评失败后的逻辑
    handleCreateFail(err) {
      // 评价已存在
      if (err.code === 1210110501) {
        Toast('评价已存在');
        this.redirectToDetailPage();
      } else {
        this.isPosting = false;
        Toast.fail(err.msg || '评价失败');
      }
    },

    redirectToDetailPage() {
      const reUrl = `${url}/wscvis/edu/evaluation-detail?assetNo=${this.assetNo}&kdtId=${kdtId}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.evaluate-create {
  width: 100%;
  position: relative;
  padding-top: 15px;
  box-sizing: border-box;
  background-color: #fff;

  &.additional {
    padding-top: 0;
  }

  &__product {
    display: flex;
    height: 40px;
    margin: 0 15px;
    padding: 10px;
    border-radius: 4px;
    background-color: #f2f3f5;

    .imgWrap {
      position: absolute;
      border-radius: 2px;
    }

    &-title {
      line-height: 20px;
      margin-left: 80px;
      font-size: 13px;
      font-weight: 500;
      color: #323233;
      word-break: break-all;
      align-self: center;

      @include multi-ellipsis(2);
    }
  }

  &__submit-btn {
    bottom: 0;
    width: 100%;
    height: 50px;
    border: none;
    z-index: 999;
    position: fixed;
    font-size: 16px;
    font-weight: 500;
    line-height: 50px;
    text-align: center;
  }

  &::after {
    content: '';
    width: 100%;
    height: 50px;
    bottom: -50px;
    position: absolute;
  }

  .van-rate__item {
    top: 2px;
    margin-left: 15px;
  }
}
</style>
