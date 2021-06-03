<template>
  <div class="other-entry">
    <template v-for="entry in entryList">
      <div
        v-if="visible(entry.name, sellType, courseType, notBeUsedAsset)"
        :key="entry.name"
        class="entry-item"
        @click="onClickEntry(entry.name)"
      >
        <vis-icon :name="entry.name" size="24px" class="entry__icon" />
        <p class="entry-title">
          {{ entry.label }}
        </p>
      </div>
    </template>
    <qrcode-popup
      v-if="!isBdapp"
      v-model="showJoinGroup"
      :title="joinGroupSetting.qrCodeGuideCopy"
      :img-src="joinGroupSetting.groupPicture || joinGroupSetting.codePicture"
      desc="识别二维码，或截图保存"
    />
  </div>
</template>
<script>
import { Icon } from '@youzan/vis-ui';
import { ZNB } from '@youzan/wxsdk';
import isEmpty from 'lodash/isEmpty';
import QrcodePopup from 'pct/components/QrcodePopup';
import { Toast } from 'vant';
import API from '../../../../api';
import { EVALUATIONSTATUS } from './constants.js';
import * as SafeLink from '@youzan/safe-link';
import { versionWrapper } from '@/vis-shared/configs/version/fns';
import { redirect } from '@/common/utils/custom-safe-link';

const baseUrl = 'https://h5.youzan.com/wscvis/edu/';
const kdtId = window._global.kdt_id;

const entryList = versionWrapper('appointCourse', [
  {
    name: 'appointmentforclass',
    label: '预约上课',
  },
  {
    name: 'lookatthetimetable',
    label: '查看课表',
  },
  {
    name: 'learningrecord',
    label: '上课记录',
  },
  // {
  //   name: 'awardrecord',
  //   label: '奖励记录',
  // },
  {
    name: 'message',
    label: '评价',
  },
]);

export default {
  name: 'intro-type',

  components: {
    'vis-icon': Icon,
    QrcodePopup,
  },

  props: {
    alias: {
      type: String,
      default: '',
    },
    entryType: {
      type: String,
      default: '',
    },
    typeDesc: {
      type: String,
      default: '',
    },
    assetNo: {
      type: String || Number,
      default: '' || 0,
    },
    assetType: {
      type: Number,
      default: 0,
    },
    joinGroupSetting: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default: '',
    },
    picture: {
      type: String,
      default: '',
    },
    studentUid: {
      type: Number,
      default: 0,
    },
    sellType: {
      type: Number,
      default: 0,
    },
    courseType: {
      type: Number,
      default: 1,
    },
    dataRange: {
      type: Object,
      default() {
        return {};
      },
    },
    notBeUsedAsset: {
      type: Number,
      default: 0,
    },
    hasExam: {
      type: Boolean,
      default: false,
    },
    examInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      // 是否展示拉群图片
      showJoinGroup: false,
      // 是否百度智能小程序
      isBdapp: false,
      // 评价入口异步状态，默认隐藏
      evaluationStatus: EVALUATIONSTATUS.HIDE_EVALUATION,
    };
  },

  computed: {
    entryList() {
      const list = entryList.slice();
      // 如果是评价隐藏状态，过滤评价入口
      if (this.evaluationStatus === EVALUATIONSTATUS.HIDE_EVALUATION) {
        return list.filter(item => item.name !== 'message');
      }
      if (this.joinGroupSetting.courseHomepageOpen) {
        list.push({
          name: 'group',
          label: this.joinGroupSetting.buttonName,
        });
      }
      if (this.hasExam) {
        list.push({
          name: 'exam',
          label: '考试',
        });
      }
      return list;
    },
  },

  created() {
    this.getEvaluationStatus();

    ZNB.getEnv().then(env => {
      if (env.platform === 'swan') {
        this.isBdapp = true;
      }
    }).catch(() => { });
  },

  methods: {
    onClickEntry(type) {
      switch (type) {
        case 'appointmentforclass':
          if (this.studentUid) {
            SafeLink.redirect({
              // url: `${baseUrl}appointment/list?kdtId=${kdtId}&assetNo=${this.assetNo}`,
              url: `${baseUrl}appointment/create?kdt_id=${kdtId}&studentId=${this.studentUid}&assetNo=${this.assetNo}&applycourseType=${this.assetType}`,
              kdtId,
            });
          }
          break;
        case 'lookatthetimetable':
          if (this.studentUid) {
            SafeLink.redirect({
              url: `${baseUrl}course-schedule?kdtId=${kdtId}&studentId=${this.studentUid}`,
              kdtId,
            });
          }
          break;
        case 'learningrecord':
          if (this.studentUid) {
            SafeLink.redirect({
              url: `${baseUrl}course-record?kdtId=${kdtId}&studentId=${this.studentUid}&assetNo=${this.assetNo}`,
              kdtId,
            });
          }
          break;
        case 'message':
          this.handleEvaluationUrl();
          break;
        case 'awardrecord':
          SafeLink.redirect({
            url: `${baseUrl}reward/record?kdt_id=${kdtId}&alias=${this.alias}`,
            kdtId,
          });
          break;
        case 'group':
          this.showPop();
          break;
        case 'exam':
          if (this.examInfo && this.examInfo.totalExamCount === 1) {
            redirect({
              url: '/wscvis/supv/examination/detail',
              query: {
                examId: this.examInfo.examId,
              },
            });
          } else {
            this.$router.push({
              name: 'ExamList',
              query: {
                alias: this.alias,
              },
            });
          }
          break;
        default:
      }
    },

    showPop() {
      this.showJoinGroup = true;
    },

    visible(type, sellType, courseType, notBeUsedAsset) {
      if (type === 'appointmentforclass' && (sellType === 3 || courseType === 0)) {
        return false;
      }
      if (type === 'appointmentforclass' && (sellType === 0 && isEmpty(this.dataRange))) {
        return false;
      }
      if (type === 'appointmentforclass' && notBeUsedAsset) {
        return false;
      }
      return true;
    },

    // 获取评价入口展示控制数据
    getEvaluationStatus() {
      API.getEvaluationPermissionApi({ assetNo: this.assetNo })
        .then((res = {}) => {
          if (res.code === 0) {
            const evaluationStatus = res.data;
            this.evaluationStatus = evaluationStatus;
          } else throw new Error(res.msg);
        })
        .catch(err => {
          err && Toast(err);
        });
    },

    // 点击评价入口处理逻辑
    handleEvaluationUrl() {
      const evaluationStatus = this.evaluationStatus;
      if (evaluationStatus === EVALUATIONSTATUS.NOT_ALLOW_EVALUATION) {
        Toast('还未到上课时间,上课后再来评价吧');
      } else {
        const url = evaluationStatus === EVALUATIONSTATUS.ALLOW_EVALUATION
          ? `${baseUrl}evaluation-create?assetNo=${this.assetNo}&title=${this.title}&imgUrl=${this.picture}&kdtId=${kdtId}`
          : `${baseUrl}evaluation-detail?assetNo=${this.assetNo}&kdtId=${kdtId}`;
        SafeLink.redirect({
          url,
          kdtId,
        });
      }
    },
  },
};
</script>
<style lang="scss">
.other-entry {
  display: flex;
  padding: 20px 0;
  margin-top: 8px;
  background-color: #fff;
  border-radius: 4px;
  flex-wrap: wrap;
  justify-content: space-between;

  .entry-item {
    margin-top: 20px;
    text-align: center;
    flex: 0 0 25%;

    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      margin-top: 0;
    }
  }

  .entry__icon {
    margin-bottom: 10px;
  }

  .entry-title {
    font-size: 13px;
    color: #323233;
  }
}
</style>
