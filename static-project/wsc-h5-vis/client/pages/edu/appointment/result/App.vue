<template>
  <vis-page-container>
    <div class="appointment-result">
      <div class="result-card">
        <div class="result-card__title">
          <vis-icon
            name="check-o"
            color="#07c160"
            size="20"
          />
          预约成功
        </div>
        <div class="result-card__description">
          恭喜你已成功预约本课程
        </div>
        <div class="result-card__actions">
          <div
            class="result-card__action result-card__action--gray"
            @click="onBtnClick('navigateToDetail')"
          >
            预约详情
          </div>
          <div
            class="result-card__action result-card__action--theme"
            @click="onBtnClick('navigateBack')"
          >
            继续预约
          </div>
        </div>
      </div>

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
    </div>
  </vis-page-container>
</template>

<script>
import { format } from 'date-fns';
import { Toast } from 'vant';
import Args from 'zan-utils/url/args';
import { Icon } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';
import TableList from '../components/table-list';
import VisPageContainer from '../../components/page-container';
import { parseCancelAppointmentRules } from '../utils/main';
import AppointmentApi from '../api';

export default {
  name: 'appointment-result',

  components: {
    'vis-icon': Icon,
    TableList,
    VisPageContainer,
  },

  data() {
    return {
      studentLessonNo: '',
      eduCourseIds: '',
      studentId: '',
      infoList: [],
    };
  },

  created() {
    this.studentLessonNo = Args.get('studentLessonNo');
    this.eduCourseIds = Args.get('eduCourseIds');
    this.studentId = Args.get('studentId');
    // 获取预约信息
    this.fetchAppointmentInfo(this.studentLessonNo);
  },

  methods: {
    fetchAppointmentInfo(studentLessonNo) {
      AppointmentApi
        .getInfo({
          studentLessonNo,
        })
        .then(data => {
          this.infoList = [
            { name: '预约课程', value: data.courseName },
            { name: '上课时间', value: `${format(data.startTime, 'YYYY-MM-DD HH:mm')}-${format(data.endTime, 'HH:mm')}` },
            { name: '学员', value: data.studentName },
            { name: '上课地点', value: data.address, hidden: !data.address },
            { name: '上课教室', value: data.classroom, hidden: !data.classroom },
            { name: '老师', value: data.teacherName, hidden: !data.teacherName },
            {
              name: '助教',
              value: data.assistantNames && data.assistantNames.join('、'),
              hidden: !data.assistantNames || (Array.isArray(data.assistantNames) && data.assistantNames.length === 0),
            },
            {
              name: '取消规则',
              value: parseCancelAppointmentRules(data),
              hidden: parseCancelAppointmentRules(data) === null,
            },
            { name: '消耗课时', value: data.cost / 100, hidden: !data.cost },
            { name: '预约人', value: data.appointmentName, hidden: !data.appointmentName },
            {
              name: '提交预约',
              value: format(data.appointmentTime, 'YYYY-MM-DD HH:mm:ss'),
              hidden: !data.appointmentTime,
            },
          ];
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {

        });
    },

    navigateBack() {
      window.history.back();
    },

    navigateToDetail() {
      const reUrl = `/wscvis/edu/appointment/detail?kdt_id=${window._global.kdt_id}&studentLessonNo=${this.studentLessonNo}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId: window._global.kdt_id,
      });
    },
    naviageToCreate() {
      const pageCreateUrl = '/wscvis/edu/appointment/create';
      const reUrl = `${pageCreateUrl}?kdt_id=${window._global.kdt_id}&eduCourseIds=${this.eduCourseIds}&studentId=${this.studentId}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId: window._global.kdt_id,
      });
    },
    onBtnClick(type) {
      this[type] && this[type]();
    },
  },
};
</script>

<style lang="scss">
.appointment-result {
  padding: 0 10px;

  .result-card,
  .info-list-card {
    margin-top: 10px;
    border-radius: 6px;
    background: #fff;
  }

  .result-card {
    padding-bottom: 25px;
    text-align: center;

    &__title {
      display: inline-block;
      margin: 25px auto 0;
      line-height: 25px;
      font-size: 18px;
      font-weight: 500;
      color: #323233;
    }

    &__description {
      margin: 15px auto 0;
      line-height: 20px;
      text-align: center;
      font-size: 14px;
      color: #969799;
    }

    &__actions {
      margin: 15px auto 0;
    }

    &__action {
      display: inline-block;
      box-sizing: border-box;
      padding: 0 22px;
      height: 30px;
      line-height: 28px;
      font-size: 14px;
      border: 1px solid;
      border-radius: 22px;

      &--gray {
        color: #323233;
        border-color: #e5e5e5;
      }

      &--theme {
        margin-left: 5px;
        color: #07c160;
        border-color: #07c160;
      }
    }
  }

  .info-list-card {
    padding: 0 12px 16px;

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
    }
  }

  .table-list-item__value {
    word-break: break-all;
  }
}
</style>
