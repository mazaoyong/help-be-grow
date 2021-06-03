<template>
  <ul class="all-sign-in f-safeArea">
    <li
      v-for="(action, index) in actionList"
      :key="index"
      class="action"
      @click="onAction(action.type)"
    >
      {{ action.text }}
    </li>

    <!-- 底部的actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowActionSheet"
      :actions="actionListMore"
      cancel-text="取消"
      @select="onSelectActionSheet"
      @cancel="isShowActionSheet = false"
    />
  </ul>
</template>

<script>
import {
  Toast,
  // Dialog,
  ActionSheet,
} from 'vant';
import { signIn } from 'pages-api';
// import { format, isAfter } from 'date-fns';
import SessionStorage from '@youzan/utils/browser/session_storage.js';
import Args from '@youzan/utils/url/args.js';
import {
  SIGN_IN_TYPE,
  // SIGN_IN_TIP,
  // SIGN_IN_TEXT
} from '../constant.js';
import mixin from '../mixin';
import * as log from '../log';
import signInFn from 'components/sign-in';

const actionList = [
  {
    type: 'all',
    text: '更多',
  },
  {
    type: 'post',
    text: '点评',
  },
  {
    type: 'sign-in',
    text: '签到',
  },
];

const actionListMore = [
  {
    type: 'not-arrived',
    name: '未到',
  },
  {
    type: 'leave',
    name: '请假',
  },
];

export default {
  name: 'all-sign-in',
  components: {
    'van-actionsheet': ActionSheet,
  },
  mixins: [mixin],
  props: {
    consumeAssetNum: {
      type: Number,
      default: 0,
    },
    studentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    lessonNo: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      default: '',
    },
    startTimeNum: {
      type: Number,
      default: 0,
    },
    kdtId: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      actionList,
      actionListMore,
      isShowActionSheet: false,
    };
  },
  methods: {
    onAction(type) {
      if (type === 'all') {
        this.isShowActionSheet = true;
        return;
      }
      if (type === 'post') {
        return this.goToPost();
      }

      const studentLessonNos = this.getStudentLessonNos();
      if (studentLessonNos.length === 0) {
        Toast('请至少选择一位学员');
        return;
      }

      this.isShowActionSheet = false;

      const checkedStudents = this.getStudentCheckedList();

      signInFn({
        props: {
          students: checkedStudents,
          type: type,
          kdtId: this.kdtId,
          startTime: this.startTimeNum,
          signInAllStudents: false,
          lessonNo: this.lessonNo,
        },
      })
        .then(() => {
          this.$bus.$emit('updateStudentList');
        });

      // const currentDate = `${format(new Date(), 'YYYY-MM-DD')} 23:59:59`;
      // if (type !== 'leave' && isAfter(this.startTime, currentDate)) { // 课程时间 > 今天
      //   Toast(`上课日期未到，不允许${SIGN_IN_TIP[type]}`);
      //   return;
      // }

      // let message = `本节课消耗学员${this.consumeAssetNum / 100}课时`;
      // if (this.consumeAssetNum === 0) { // 消耗课时数为0
      //   message = '';
      // } else if (this.sellTypeNotLesson()) { // 选择的所有学员的课程都不是按课程售卖的
      //   message = '';
      // } else if (type === 'leave' && this.writeOffRuleLeave === 0) { // 请假不消课
      //   message = '';
      // } else if (type === 'not-arrived' && this.writeOffRuleTruancy === 0) { // 未到不消课
      //   message = '';
      // }
      // Dialog.confirm({
      //   title: `确认${studentLessonNos.length}名学员${SIGN_IN_TEXT[type]}？`,
      //   message,
      // }).then(() => {
      //   this.sendSignIn(type);
      // }).catch(() => {});
    },
    sellTypeNotLesson() {
      let bool = true;
      this.studentList.map(student => {
        if (student.isSelected && student.sellType === 1) { // 只要其中一个学员按课时售卖的，就显示消耗课时数
          bool = false;
        }
      });

      return bool;
    },
    sendSignIn(type) {
      const studentLessonNos = this.getStudentLessonNos();
      signIn.SignIn({
        lessonNo: this.lessonNo,
        signInType: SIGN_IN_TYPE[type],
        signInAllStudents: false,
        studentLessonNos,
        kdtId: this.kdtId, // 支持连锁
      }).then(res => {
        const taskNo = res;
        this.getActionResult(taskNo, type, this.kdtId);
      }).catch(msg => {
        Toast(msg || '批量操作失败');
        this.$bus.$emit('updateStudentList');
      });
    },
    // 获取全选的学员的lessonNo列表
    getStudentLessonNos() {
      const lessonNosArr = [];
      this.studentList.map(student => {
        if (student.isSelected) {
          lessonNosArr.push(student.studentLessonNo);
        }
      });
      return lessonNosArr;
    },

    // 获取选中的学员列表
    getStudentCheckedList() {
      return this.studentList.filter(student => student.isSelected);
    },

    onSelectActionSheet(type) {
      this.onAction(type.type);
    },
    getStudentinfos() {
      return this.studentList.filter(item => item.isSelected)
        .map(student => {
          return {
            id: student.studentId,
            name: student.studentName,
          };
        });
    },
    goToPost() {
      const students = this.getStudentinfos();
      if (students.length === 0) {
        Toast('请至少选择一位学员');
        return;
      }
      console.log('批量点评');

      log.logCreateBatchMoments();

      try {
        const studentsSessionCache = {
          list: students,
          excludeIds: [],
          isSelectedAll: false,
          selectedCount: students.length,
        };

        SessionStorage.setItem('vis__miniprogram__moments__students', JSON.stringify(studentsSessionCache));
      } catch (error) {
      }

      const location = Args.add('/v4/vis/h5/edu/moments/post-edit', {
        useSessionOfStudents: 1,
        pageFrom: 1,
        kdtId: this.kdtId,
        lessonNo: this.lessonNo,
        onlyOneStudent: students.length === 1 ? 1 : 0,
        redirectUrl: encodeURIComponent(window.location.href),
      });
      window.location.href = location;
    },
  },
};
</script>

<style lang="scss" scoped>
.all-sign-in {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, .05);
  .action {
    position: relative;
    display: block;
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #00b389;
    &::after {
      position: absolute;
      top: 13px;
      right: 0;
      display: block;
      content: '';
      width: 1px;
      height: 24px;
      background-color: #f2f3f5;
    }
    &:last-child {
      &::after {
        width: 0;
      }
    }
  }
}
</style>
