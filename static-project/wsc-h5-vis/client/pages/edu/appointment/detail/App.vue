<template>
  <vis-page-container>
    <div class="appointment-detail">
      <info-card
        :title="eduCourseName"
        :body-list="[
          { icon: 'course', value: lessonContent, hidden: !lessonContent },
          { icon: 'time', value: classTime },
        ]"
        :footer-list="[
          { name: '学员', value: studentName }
        ]"
        :footer-name-width="82"
        :show-status="isCancelled"
        status-text="已取消"
      />

      <div class="info-list-card">
        <div class="info-list-card__title">
          预约信息
        </div>
        <table-list
          :list="infoList"
          :name-width="82"
          class="info-list-card__table-list"
        />
      </div>

      <div
        v-if="isCanCancel"
        class="cancel-btn main-btn"
        @click="onCancelClick"
      >
        取消预约
      </div>
    </div>
  </vis-page-container>
</template>

<script>
import { format } from 'date-fns';
import { assign } from 'lodash';
import { Toast } from 'vant';
import Args from 'zan-utils/url/args';
import { InfoCard } from '@youzan/vis-ui';
import VisPageContainer from '../../components/page-container';
import TableList from '../components/table-list';
import { parseCancelAppointmentRules } from '../utils/main';
import AppointmentApi from '../api';

const global = window._global;
const kdtId = global.kdt_id || 0;

export default {
  name: 'appointment-detail',

  components: {
    InfoCard,
    VisPageContainer,
    TableList,
  },

  data() {
    return {
      studentLessonNo: '',
      appointmentStatus: '',

      // 以下字段直接从详情接口取
      status: 0,
      eduCourseName: '',
      lessonContent: '',
      startTime: '',
      endTime: '',
      studentName: '',
      addressName: '',
      classroom: '',
      teacherName: '',
      assistantNames: [],
      appointmentUserName: '',
      appointmentTime: '',
      cost: 0,
      canCancelAppointmentSetting: 0,
      canCancelAppointmentHour: 0,
    };
  },

  computed: {
    isCancelled() {
      return this.status === 5;
    },
    isCanCancel() {
      return !this.isCancelled && this.canCancel;
    },
    classTime() {
      return this.startTime ? `${format(this.startTime, 'YYYY[年]MM[月]DD[日] HH:mm')}-${format(this.endTime, 'HH:mm')}` : '-';
    },
    infoList() {
      return [
        { name: '上课地点', value: this.addressName, hidden: !this.addressName },
        { name: '上课教室', value: this.classroom, hidden: !this.classroom },
        { name: '老师', value: this.teacherName, hidden: !this.teacherName },
        {
          name: '助教',
          value: this.assistantNames && this.assistantNames.join('、'),
          hidden: !this.assistantNames || (Array.isArray(this.assistantNames) && this.assistantNames.length === 0),
        },
        {
          name: '取消规则',
          value: parseCancelAppointmentRules(this),
          hidden: parseCancelAppointmentRules(this) === null,
        },
        { name: '消耗课时', value: this.consumeAssetNum / 100, hidden: !this.consumeAssetNum },
        {
          name: '预约人',
          value: this.origin === 3 ? `${this.appointmentUserName}（机构员工）` : this.appointmentUserName || '-',
        },
        {
          name: '提交预约',
          value: format(this.appointmentTime, 'YYYY-MM-DD HH:mm:ss'),
          hidden: !this.appointmentTime,
        },
      ];
    },
  },

  created() {
    this.studentLessonNo = Args.get('studentLessonNo') || '';
    // 获取预约详情数据
    this.fetchAppointmentDetail();
  },

  methods: {
    fetchAppointmentDetail() {
      AppointmentApi
        .getDetail({
          studentLessonNo: this.studentLessonNo,
          kdtId,
        })
        .then(res => {
          assign(this, res);
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {

        });
    },

    fetchCancelAppointment() {
      AppointmentApi
        .getCancelAppointment({
          studentLessonNo: this.studentLessonNo,
        })
        .then(res => {
          this.fetchAppointmentDetail();
        })
        .catch(err => {
          Toast(err);
          console.error(err);
        })
        .finally(() => {

        });
    },

    onCancelClick() {
      this.fetchCancelAppointment();
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.appointment-detail {
  padding: 0 10px;

  .info-card {
    padding: 16px 12px;
  }

  .info-list-card {
    margin-top: 10px;
    padding: 0 12px 16px;
    background: #fff;
    border-radius: 4px;

    &__title {
      box-sizing: border-box;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      font-weight: 500;
      color: #323233;
      border-bottom: 1px solid #f2f2f2;
    }

    &__table-list {
      margin-top: 8px;

      .table-list-item__value {
        @include multi-ellipsis(1);
      }
    }
  }

  .cancel-btn {
    margin-top: 20px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    background: #00b389;
    border-radius: 22px;
  }

  // 课节名称完整显示
  .table-list-item__value {
    word-break: break-all;
  }
}
</style>
