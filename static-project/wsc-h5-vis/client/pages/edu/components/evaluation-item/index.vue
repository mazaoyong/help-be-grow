<template>
  <div class="evaluation-item">
    <div v-if="isFormated">
      <!-- 用户信息区域 -->
      <user-wrap
        :avatar="mainEvaluation.avatar"
        :nick-name="mainEvaluation.nickName"
        :score="mainEvaluation.score"
        :evaluation-at="mainEvaluation.evaluationAt"
        :theme-color="themeColor"
      />
      <!-- 评价文本区域 -->
      <evaluation-content
        :evaluation="mainEvaluation.evaluation"
        :theme-color="themeColor"
        :content-style="contentStyle"
      />
      <!-- 评价图文区域 -->
      <img-list
        v-if="(mainEvaluation.pictures || []).length > 0"
        :list="mainEvaluation.pictures"
        :mode="mode"
      />
      <!-- 点赞操作按钮 -->
      <action-bar
        v-if="isShowAction"
        :support-count="mainEvaluation.supportCount"
        :has-supported="mainEvaluation.hasSupported"
        :theme-color="themeColor"
        @thumb="onThumb"
      />
      <template v-if="isShowAdditionAndReply">
        <!-- 追评之前的商家回复 -->
        <merchant-reply
          v-for="(item, index) in evaluation.merchantReplyBefore"
          :key="index"
          :value="item"
          class="merchant-reply"
        />
        <!-- 用户追评 -->
        <buyer-review
          v-if="evaluation.buyerReview"
          :mode="mode"
          :value="evaluation.buyerReview"
        />
        <!-- 追评之后的商家回复 -->
        <merchant-reply
          v-for="(item, index) in evaluation.merchantReplyAfter"
          :key="index"
          :value="item"
          class="merchant-reply"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { themeColor } from 'common/constants';
import UserWrap from './components/UserWrap';
import EvaluationContent from './components/EvaluationContent';
import ImgList from './components/ImgList';
import ActionBar from './components/ActionBar';
import MerchantReply from './components/MerchantReply';
import BuyerReview from './components/BuyerReview';
import API from '../../api';
import { ModuleConfig } from './constants';

const globalTheme = window._global.globalTheme;

export default {
  name: 'evaluation-item',

  components: {
    UserWrap,
    EvaluationContent,
    ImgList,
    ActionBar,
    MerchantReply,
    BuyerReview,
  },

  props: {
    evaluation: {
      type: Object,
      default: function() {
        return {};
      },
    },
    isLogin: {
      type: Boolean,
      default: true,
    },
    /**
     * 展示的模块
     * actionBar: 展示点赞按钮区
     * additionAndReply: 展示追评与商家回复
     */
    showModule: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * 主评价文本区域展示方式
     * ellipsis: 默认展示两行，超出...
     * fold: 默认展示5行，超出会有展开收起效果
     */
    contentStyle: {
      type: String,
      default: '',
    },
    mode: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      isFormated: false,
      isShowAction: false,
      isShowAdditionAndReply: false,
      mainEvaluation: {},
      // mode: 0,
      buyerReview: {},
      merchantReplyBefore: [],
      merchantReplyAfter: [],
      isThumbing: false,
      themeColor: '',
    };
  },

  mounted() {
    this.themeColor = themeColor[globalTheme];
    this.formatEvaluations();
  },

  methods: {
    formatEvaluations() {
      const {
        mainEvaluation,
        buyerReview,
        merchantReplyBefore,
        merchantReplyAfter,
      } = this.evaluation;
      this.mainEvaluation = mainEvaluation;
      this.buyerReview = buyerReview;
      this.merchantReplyBefore = merchantReplyBefore;
      this.merchantReplyAfter = merchantReplyAfter;
      // this.mode = this.from !== 'evaluationDetail' ? 0 : 1;
      this.isShowAction = this.showModule.indexOf(ModuleConfig.actionBar) !== -1;
      this.isShowAdditionAndReply = this.showModule.indexOf(ModuleConfig.additionAndReply) !== -1;
      this.isFormated = true;
    },

    onThumb() {
      if (!this.isLogin) {
        this.$emit('login');
        return;
      }
      if (this.isThumbing) { return; }
      const hasSupported = !this.mainEvaluation.hasSupported;
      const evaluationAlias = this.mainEvaluation.evaluationAlias;
      API.doLikeApi({ evaluationAlias }, hasSupported)
        .then(res => {
          this.onThumbOk(this.mainEvaluation);
          this.isThumbing = false;
        })
        .catch(msg => {
          this.isThumbing = false;
          Toast(msg || '请求失败');
        });
    },
    onThumbOk(evaluation) {
      if (evaluation.hasSupported) {
        evaluation.hasSupported = 0;
        evaluation.supportCount -= 1;
      } else {
        evaluation.hasSupported = 1;
        evaluation.supportCount += 1;
      }
    },
  },
};
</script>

<style lang="scss">
.evaluation-item {
  padding: 5px 15px;
  background-color: #fff;
}
</style>
