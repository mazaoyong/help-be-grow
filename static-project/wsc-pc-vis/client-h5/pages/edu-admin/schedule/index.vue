<template>
  <div class="container">
    <switch-bar
      v-if="!isEduSingleStore && !isWscApp"
      :campus-name="campusName"
      :campus-total="campusTotal"
    />
    <course-header
      :header="header"
      :is-trial="isTrial"
    />
    <course-detail
      class="course-detail-extend-class"
      :detail="detail"
    />
    <div
      v-if="studentList.length > 0"
      class="student-list"
    >
      <action-header
        :student-list="studentList"
        :start-time-num="startTimeNum"
        :student-uncheck-amount="studentUncheckAmount"
        :lesson-no="lessonNo"
        :kdt-id="kdtId"
        :is-trial="isTrial"
        @batchAction="onBatchAction"
        @go-add-student="onAddStudentGo"
      />
      <student-item
        v-for="(student, index) in studentList"
        :key="index"
        :start-time="startTime"
        :start-time-num="startTimeNum"
        :consume-asset-num="consumeAssetNum"
        :write-off-rule-leave="writeOffRuleLeave"
        :write-off-rule-truancy="writeOffRuleTruancy"
        :student="student"
        :is-show-all-sign-in="isShowAllSignIn"
        :lesson-no="lessonNo"
        :kdt-id="kdtId"
        @remove="onStudentRemove(student)"
      />
    </div>
    <all-sign-in
      v-if="isShowAllSignIn"
      :start-time="startTime"
      :start-time-num="startTimeNum"
      :consume-asset-num="consumeAssetNum"
      :student-list="studentList"
      :lesson-no="lessonNo"
      :kdt-id="kdtId"
    />

    <!-- 学员列表空状态 开始 -->
    <div
      v-else-if="isNotLoading && studentList.length === 0"
      class="no-student-list"
    >
      <span class="tip">暂无学员</span>
      <div
        v-if="!isTrial"
        class="no-student-list__button"
        @click="onAddStudentGo"
      >
        添加学员
      </div>
    </div>
    <!-- 学员列表空状态 结束 -->
  </div>
</template>

<script>
import { Toast } from 'vant';
import { isToday, format, isAfter } from 'date-fns';
import Args from 'zan-utils/url/args';
import { getKdtId } from 'utils/funcs';
import { signIn, studentApi } from 'pages-api';
import get from 'lodash/get';
import courseHeader from './components/course-header.vue';
import courseDetail from './components/course-detail.vue';
import actionHeader from './components/action-header.vue';
import studentItem from './components/student-item.vue';
import allSignIn from './components/all-sign-in.vue';
import switchBar from '../../../components/switch-bar';
import './event-bus.js';
import { isEduSingleStore } from '@youzan/utils-shop';
import UA from '@youzan/utils/browser/ua_browser';
import * as log from './log';

const _global = window._global;

export default {
  name: 'sign-in',
  components: {
    'course-header': courseHeader,
    'course-detail': courseDetail,
    'action-header': actionHeader,
    'student-item': studentItem,
    'all-sign-in': allSignIn,
    'switch-bar': switchBar,
  },
  data() {
    return {
      isEduSingleStore,
      isNotLoading: false,
      isShowAllSignIn: false,
      lessonNo: Args.get('lessonNo') || '',
      isTrial: 0, // 试听课程
      header: { // 专门存课程头部的信息
        date: '', // 日期
        time: '',
        eduCourseName: '', // 课程名称
        categoryName: '', // 排课名称
      },
      detail: { // 专门存到课的明细信息
        notSignInNum: 0, // 待签到人数
        signInNum: 0, // 已签到人数
        leaveNum: 0, // 请假人数
        notArrivedNum: 0, // 未到人数
      },
      startTime: '', // 课程日期
      startTimeNum: 0,
      kdtId: getKdtId({ fromUrl: true }),
      consumeAssetNum: 0, // 当前课程需要消耗的课时数
      writeOffRuleLeave: 0, // 请假是否算核销，1算 0不算
      writeOffRuleTruancy: 0, // 旷课是否算核销，1算 0不算
      studentList: [], // 学员列表
      campusName: _global.shopInfo && _global.shopInfo.shopName,
      campusTotal: _global.campusInfo && _global.campusInfo.total,
      isWscApp: UA.isWsc(), // 微商城app
      studentUncheckAmount: 0, // 后端返回的学员总数
    };
  },
  created() {
    this.getStudentList();
    this.initEvent();

    log.logVisitSchedualDetail();
  },
  methods: {
    initEvent() {
      this.$bus.$on('updateStudentList', () => {
        this.isShowAllSignIn = false;
        this.getStudentList();
        this.$bus.$emit('resetState');
      });
      this.$bus.$on('updateStudentSelect', (student) => {
        this.studentList.map(item => {
          if (item.studentId === student.studentId) {
            item.isSelected = student.isSelected;
          }
          return item;
        });

        this.$bus.$emit('updateSelectedNum', this.studentList);
      });
      this.$bus.$on('checkSelectAll', () => {
        let isSelectedAll = true;
        this.studentList.map(item => {
          // 如果能选中的都全部都选中了，那就是被全选了，反之则没被全选
          if (item.canSelect && !item.isSelected) {
            isSelectedAll = false;
          }
        });

        this.$bus.$emit('updateSelectAll', isSelectedAll);
      });
    },

    fetchRemoveStudent(student) {
      signIn
        .RemoveStudent({
          studentId: student.studentId,
          studentLessonNo: student.studentLessonNo,
          kdtId: this.kdtId,
        })
        .then(res => {
          this.getStudentList();
        })
        .catch(errMsg => {
          Toast(errMsg || '移除失败');
        });
    },

    // 获取学员列表
    getStudentList() {
      // signIn.GetStudentList({
      studentApi.findStudentsV3({
        pageNumber: 1,
        pageSize: 1000,
        lessonNo: this.lessonNo,
        kdtId: this.kdtId,
      }).then(res => {
        // 设置header信息
        const date = format(res.startTime, 'MM月DD日');
        this.header.date = isToday(res.startTime) ? `${date} 今天` : date;
        this.header.time = `${format(res.startTime, 'HH:mm')} - ${format(res.endTime, 'HH:mm')}`;
        this.header.eduCourseName = res.eduCourseName || '';
        this.header.categoryName = res.categoryName || '';
        this.isTrial = res.isTrial || 0;

        // 设置detail信息
        this.detail.notSignInNum = res.studentUnSignInCount || 0;
        this.detail.signInNum = res.studentComeCount || 0;
        this.detail.leaveNum = res.studentAskForLeaveCount || 0;
        this.detail.notArrivedNum = res.studentAbsenceCount || 0;

        this.startTime = format(res.startTime, 'YYYY-MM-DD HH:mm:ss') || ''; // 设置当前课程的上课时间
        this.startTimeNum = res.startTime;
        this.endTime = format(res.endTime, 'YYYY-MM-DD HH:mm:ss') || ''; // 设置当前课程的结束时间
        this.consumeAssetNum = res.consumeAssetNum || 0; // 设置当前课程的消耗课时数
        this.writeOffRuleLeave = res.writeOffRuleLeave || 0; // 请假是否算核销，1算 0不算
        this.writeOffRuleTruancy = res.writeOffRuleTruancy || 0; // 旷课是否算核销，1算 0不算
        const studentList = (res.students && res.students.content) || []; // 设置学员列表
        this.studentList = this.parseStudentList(studentList);
        this.studentUncheckAmount = get(res, 'studentUnSignInCount', 0); // 学员总数

        this.isNotLoading = true;
      })
        .catch(msg => {
          this.isNotLoading = true;
          Toast(msg || '获取学员列表失败');
        });
    },
    // 给studentList增加附加参数
    parseStudentList(studentList) {
      studentList.map(student => {
        const { info, canSelect } = this.setExtendData(student);
        student.info = info;
        student.canSelect = canSelect;
        return student;
      });

      return studentList;
    },
    // 设置扩展信息
    setExtendData(student = {}) {
      let info = {
        showMoreBtn: true,
        showSignInBtn: true,
        showRemoveBtn: false,
        showChangeBtn: false,
        // isShowActionBtn: true,
        text: '',
      };

      if (student.signInStatus === 1) {
        info.showMoreBtn = false;
        info.showSignInBtn = false;
        info.showRemoveBtn = false;
        info.showChangeBtn = true;
        info.text = '已签到';
      } else if (student.signInStatus === 2) {
        info.showMoreBtn = false;
        info.showSignInBtn = false;
        info.showRemoveBtn = false;
        info.showChangeBtn = true;
        info.text = '请假';
      } else if (student.signInStatus === 3) {
        info.showMoreBtn = false;
        info.showSignInBtn = false;
        info.showRemoveBtn = false;
        info.showChangeBtn = true;
        info.text = '未到';
      } else if (student.hasLockAsset) { // 如果已经锁定了资产，则直接可签到
        info.showMoreBtn = true;
        info.showSignInBtn = true;
        info.showRemoveBtn = false;
        info.showChangeBtn = false;
        info.text = '';
      } else if (student.assetState === 0 || student.assetState === 1) { // 资产未生效
        if (student.assetValidityType === 1 && isAfter(student.assetEnableTime, this.startTime)) { // 课程生效时间 > 当前时间
          info.showMoreBtn = false;
          info.showSignInBtn = false;
          info.showRemoveBtn = true;
          info.showChangeBtn = false;
          info.text = `${format(student.assetEnableTime, 'YYYY-MM-DD')}生效`;
        }
      } else if (student.assetState === 2) { // 资产已生效
        if (isAfter(this.startTime, student.assetEndTime)) { // 当前时间 > 资产过期时间
          info.showMoreBtn = false;
          info.showSignInBtn = false;
          info.showRemoveBtn = true;
          info.showChangeBtn = false;
          info.text = '课程已到期';
        } else if (student.availableAsset < this.consumeAssetNum && student.sellType === 1) {
          info.showMoreBtn = false;
          info.showSignInBtn = false;
          info.showRemoveBtn = true;
          info.showChangeBtn = false;
          info.text = '课时不足';
        }
      } else if (student.assetState === 3) {
        info.showMoreBtn = false;
        info.showSignInBtn = false;
        info.showRemoveBtn = true;
        info.showChangeBtn = false;
        info.text = '课程已到期';
      }
      return {
        info,
        canSelect: true,
      };
    },
    onBatchAction(bool) {
      this.isShowAllSignIn = bool;
      if (!bool) {
        this.$bus.$emit('resetState');
      }
    },

    onStudentRemove(student) {
      this.fetchRemoveStudent(student);
    },

    onAddStudentGo() {
      window.location.href = `/v4/vis/h5/edu/add-student?lessonNo=${this.lessonNo}&kdtId=${this.kdtId}&startTime=${this.startTime}&endTime=${this.endTime}`;
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #f7f8fa;
}
</style>
<style lang="scss" scoped>
.container {
  padding: 12px 10px 60px;
  width: 100%;
  min-height: 100%;
  background-color: #f7f8fa;
  .course-detail-extend-class {
    margin: 10px 0;
  }
  .student-list {
    padding: 15px;
    background-color: #fff;
    border-radius: 4px;
  }
  .no-student-list {
    position: absolute;
    top: 345px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 80px;
    height: 124px;
    background-image: url('https://b.yzcdn.cn/public_files/2019/03/12/9d9c065ca679da115f7b547c99dbf3d1.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 80px 80px;

    .tip {
      display: inline-block;
      position: absolute;
      left: 7px;
      bottom: 0;
      font-size: 14px;
      color: #999;
      line-height: 1;
    }

    &__button {
      position: absolute;
      left: calc(50% - 7px);
      bottom: -50px;
      transform: translateX(-50%);
      margin: 20px auto 0;
      box-sizing: border-box;
      padding: 0 22px;
      width: 100px;
      line-height: 28px;
      white-space: nowrap;
      font-size: 14px;
      color: #00b389;
      border: 1px solid #00b389;
      border-radius: 22px;
    }
  }
}
</style>
