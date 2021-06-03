<template>
  <!-- 主要逻辑已迁移到公共组建 get-course ，奖励与好友助力领取可用该组w件在奖励目录下重新实现 -->
  <div class="get-award">
    <!-- 线上课程 -->
    <div
      v-if="isKnowledge && knowledgeMixin.collectInfoSetting !== null && knowledgeMixin.collectInfoSetting"
      class="get-online-award"
    >
      <!-- 信息采集 -->
      <info-collector
        v-if="knowledgeMixin.collectInfoSetting.length > 0"
        submit-text="领取免费课程"
        :info-collection-items="knowledgeMixin.collectInfoSetting"
        :info-collect-dto="knowledgeMixin.collectInfoDTO"
        :need-verify-code="knowledgeMixin.needVerifyCode"
        :scene="2"
        @change="knowledgeMixin.handleSubmitCollectInfo"
        @submit="submit"
        @sendCaptcha="handleSendCaptcha"
      />
      <!-- 信息采集插件过期的情况 -->
      <div v-if="knowledgeMixin.collectInfoSetting.length === 0" class="get-online-award-no-info-collector">
        <img src="https://img01.yzcdn.cn/upload_files/2020/12/09/Fuk_lS5mF1ZkoLXEWPeKT-pGdFma.png" alt="gift">
        <van-button
          class="get-award__btn"
          type="primary"
          size="large"
          round
          @click="submit"
        >
          领取免费课程
        </van-button>
      </div>
    </div>

    <!-- 线下课程 -->
    <div v-if="isEduCourse" class="get-award__form">
      <!-- 选择学员 -->
      <select-student @choose-student="chooseStudent" />
      <!-- 填写上课地点 -->
      <course-info @select-time="selectTime" @select-address="selectAddress" />
      <van-button
        class="get-award__btn"
        type="primary"
        size="large"
        round
        @click="submit"
      >
        领取免费课程
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import Args from 'zan-utils/url/args';
import { sendCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';
import InfoCollector from 'components/info-collect-popup/main';
import mixinVisPage from 'common/mixins/mixin-vis-page';

import SelectStudent from './components/select-student';
import CourseInfo from './components/course-info';
import knowledgeMixin from './mixin/knowledge-mixin';
import courseMixin from './mixin/course-mixin';

export default {
  name: 'get-award',
  components: {
    'van-button': Button,
    'select-student': SelectStudent,
    'course-info': CourseInfo,
    'info-collector': InfoCollector,
  },
  mixins: [mixinVisPage, knowledgeMixin, courseMixin],
  config: {
    title: '领取课程',
  },
  data() {
    const type = Number(Args.get('type')) || 10;
    return {
      isEduCourse: type === 10,
      isKnowledge: type !== 10,
      loading: false,

      recordId: Args.get('recordId') || '',

      student: {},
      time: {},
      address: {},
    };
  },
  created() {
    if (this.isKnowledge) {
      this.knowledgeMixin.getCollectInfoByAlias();
    }
  },
  methods: {
    chooseStudent(studentInfo) {
      this.student = studentInfo;
    },
    selectTime(timeInfo) {
      this.time = timeInfo;
    },
    selectAddress(addressInfo) {
      this.address = addressInfo;
    },
    submit() {
      const ctx = this;
      if (this.isEduCourse) {
        this.courseMixin.submitCourseReward(ctx);
      } else if (this.isKnowledge) {
        this.knowledgeMixin.submitKnowledgeReward();
      }
    },

    // 发送验证码
    handleSendCaptcha(mobile, callBack) {
      sendCheckSmsCaptcha({
        mobile,
        scene: 2,
        callBack,
      });
    },
  },
};
</script>

<style lang="scss">
.get-award {
  padding: 10px;

  .vis-card {
    margin: 0;
    margin-bottom: 20px;
  }

  &__btn {
    height: 44px;
    line-height: 44px;
    border: 0;
  }

  &__form {
    margin-bottom: 32px;
    overflow: hidden;
    border-radius: 8px;

    .vis-label {
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.get-online-award {
  &-no-info-collector {
    padding: 0 14px;
    text-align: center;

    img {
      height: 160px;
      height: 160px;
      margin: 78px 0 40px 0;
    }

    button {
      height: 44px;
      line-height: 44px;
      background-color: #00b389;
      border: 0;
    }
  }
}

.vis-dynamic-form-container .submit-button {
  position: relative !important;
  padding: 0;
  background-color: transparent;
}

.se__field:last-child::after {
  display: none;
}
</style>
