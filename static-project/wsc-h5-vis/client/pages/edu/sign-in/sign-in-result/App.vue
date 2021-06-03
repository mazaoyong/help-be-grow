<template>
  <div
    v-if="isInited"
    class="sign-in-result"
  >
    <sign-in-status
      :info="{
        studyTimes,
        remainingAsset,
        isStudyByCount
      }"
    />
    <!-- 老师群 -->
    <vis-promote-card
      :qrcode="promoteInfo.codePicture"
      :btn-text="promoteInfo.buttonCopy"
      :title="promoteInfo.guideTitle"
      :desc="promoteInfo.guideCopy"
      :group-open="promoteInfo.groupOpen"
      class="sign-in-result__qrcode"
    />
    <!-- 卡片 -->
    <vis-info-card
      :footer-list="card"
      title="签到信息"
      class="sign-in-result__card"
    />
  </div>
</template>

<script>
import { Toast } from 'vant';
import { format } from 'date-fns';
import { InfoCard, PromoteCard } from '@youzan/vis-ui';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import args from 'zan-utils/url/args';

import Api from '../api.js';
import { COURSE_SELL_TYPE } from '../../constant.js';

import SignInStatus from './components/SignInStatus.vue';

export default {
  name: 'sign-in-result',

  config: {
    title: '签到成功',
    log: {
      auto: true,
      type: 'x',
      id: 0,
    },
  },

  components: {
    'sign-in-status': SignInStatus,
    'vis-info-card': InfoCard,
    'vis-promote-card': PromoteCard,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      isInited: false,

      studyTimes: 0, // 已学次数
      remainingAsset: 0, // 剩余资产课时
      isStudyByCount: false, // 是否是按课时销售
      card: [], // 卡片所需字段
      promoteInfo: {}, // 推广信息
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    const studentLessonNo = args.get('studentLessonNo');
    Api.getSignedResult({
      studentLessonNo,
    })
      .then(res => {
        this.setLocalState(res || {});
        this.isInited = true;

        return Api.getPromoteResult();
      })
      .then(res => {
        this.setLocalPromoteState(res || {});
      })
      .catch(err => {
        Toast(err);
      });
  },

  methods: {
    /**
     * @description 往 data 塞数据
     * @param {Object} res - 后端 返回 数据
     * @returns undefined
     */
    setLocalState(res) {
      const {
        studyTimes,
        remainingAsset,
        sellType,
      } = res;

      this.studyTimes = studyTimes;
      this.remainingAsset = remainingAsset;
      this.isStudyByCount = sellType === COURSE_SELL_TYPE.COUNT;

      const card = this.genCard(res);
      this.card = card;
    },

    setLocalPromoteState(res) {
      const {
        buttonCopy,
        codePicture,
        guideCopy,
        guideTitle,
        groupOpen,
      } = res;

      this.promoteInfo = {
        buttonCopy,
        codePicture,
        guideCopy,
        guideTitle,
        groupOpen,
      };
    },

    /**
     * @description 获取卡片数据
     * @returns {Array}
     */
    genCard(res) {
      const {
        studentName,
        eduCourseName,
        cost,
        signInTime,
      } = res;

      const { isStudyByCount } = this;

      const studentNameObj = {
        name: '学员',
        value: studentName,
      };

      const eduCourseNameObj = {
        name: '课程',
        value: eduCourseName,
      };

      const costObj = {
        name: '消耗课时',
        value: cost / 100,
      };

      const signInTimeObj = {
        name: '签到时间',
        value: format(+signInTime, 'YYYY-MM-DD HH:mm:ss'),
      };

      return isStudyByCount
        ? [studentNameObj, eduCourseNameObj, costObj, signInTimeObj]
        : [studentNameObj, eduCourseNameObj, signInTimeObj];
    },
  },
};
</script>

<style lang="scss">
  .sign-in-result {

    &__card {
      margin: 0 10px;
      box-sizing: border-box;
    }

    &__qrcode {
      margin: 10px;
    }
  }
</style>
