<template>
  <div class="student-item">
    <!-- 单选按钮 开始 -->
    <div v-if="isShowAllSignIn" class="select">
      <span
        v-if="!student.canSelect"
        class="check-empty check-empty-disable"
      />
      <vis-icon
        v-else-if="isSelected"
        name="check"
        size="20px"
        color="#00b389"
        @click="onSelectStudent('no-select')"
      />
      <span
        v-else
        class="check-empty"
        @click="onSelectStudent('select')"
      />
    </div>
    <!-- 单选按钮 结束 -->

    <!-- 学生相关信息 开始 -->
    <div class="student-info">
      <span class="name">
        {{ student.studentName }}
        <van-tag
          v-if="student.courseType === 0"
          color="#00b389"
          plain
        >试听</van-tag>
      </span>
      <span
        v-if="isShowStudiedAsset"
        class="text"
      >
        <span>已上课时</span>
        <span>{{ student.studied / 100 }}</span>
      </span>
      <span
        v-if="isShowAvailableAsset"
        class="text"
      >
        <span>剩余课时</span>
        <span>{{ student.availableAsset / 100 }}</span>
      </span>
      <span
        v-if="validityTime"
        class="text"
      >
        <span>有效期</span>
        <span>{{ validityTime }}</span>
      </span>
    </div>
    <!-- 学生相关信息 结束 -->

    <span v-if="student.info.text" class="signIn-disable">
      {{ student.info.text }}
    </span>

    <!-- 签到按钮或不可签到的信息 开始 -->
    <div class="course-info">
      <div v-if="!isShowAllSignIn">
        <a
          v-if="student.info.showMoreBtn"
          href="javascript: void(0);"
          class="btn btn-more"
          @click="onMore"
        >
          更多
        </a>
        <a
          v-if="student.info.showSignInBtn"
          href="javascript: void(0);"
          class="btn btn-signIn"
          @click="onSignInAction('sign-in')"
        >
          签到
        </a>
        <a
          v-if="student.info.showRemoveBtn"
          href="javascript: void(0);"
          class="btn btn-more"
          @click="onRemove"
        >
          移除
        </a>
        <a
          v-if="student.info.showChangeBtn"
          href="javascript: void(0);"
          class="btn btn-signIn btn-change"
          :class="{ 'btn-change--signined': student.signInStatus === 1 }"
          @click="onChange"
        >
          更改状态
        </a>
        <a
          v-if="student.signInStatus === 1"
          href="javascript: void(0);"
          class="btn btn-post"
          @click="onPost"
        >
          点评
        </a>
      </div>
    </div>
    <!-- 签到按钮或不可签到的信息 结束 -->

    <!-- 底部的actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="onSelectActionSheet"
      @cancel="onCancelActionSheet"
    />
    <!-- 底部的actionsheet 结束 -->

    <!-- 更改状态的actionsheet 开始 -->
    <van-actionsheet
      v-model="showChangeAction"
      :actions="changeActions"
      cancel-text="取消"
      @select="onSelectChangeAction"
      @cancel="onCancelChangeAction"
    />
    <!-- 更改状态的actionsheet 结束 -->
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import { Tag, Toast, ActionSheet, Dialog } from 'vant';
import SessionStorage from '@youzan/utils/browser/session_storage.js';
import Args from '@youzan/utils/url/args.js';
import {
  format,
  // isAfter
} from 'date-fns';
import { signIn } from 'pages-api';
import {
  SIGN_IN_TYPE,
  // SIGN_IN_TIP,
  // SIGN_IN_TEXT
} from '../constant.js';
import mixin from '../mixin';
import * as log from '../log';
import signInFn from 'components/sign-in';

export default {
  name: 'student-item',
  components: {
    'vis-icon': Icon,
    'van-tag': Tag,
    'van-actionsheet': ActionSheet,
  },
  mixins: [mixin],
  props: {
    consumeAssetNum: {
      type: Number,
      default: 0,
    },
    writeOffRuleLeave: {
      type: Number,
      default: 0,
    },
    writeOffRuleTruancy: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: String,
      default: '',
    },
    startTimeNum: {
      type: Number,
      default: 0,
    },
    isShowAllSignIn: {
      type: Boolean,
      default: false,
    },
    lessonNo: {
      type: String,
      default: '',
    },
    kdtId: {
      type: [Number, String],
      default: 0,
    },
    /** assetEnableTime: 课程有效期开始
    * assetState: 资产状态 1 未生效 2 已生效 3 已失效
    * availableAsset: 可用课时
    * assetEndTime: 资产失效时间
    * assetValidityType: 资产生效类型 0 永久有效 1 创建时设置有效期 2 第一次锁定资产时生效 3 第一次消耗资产时生效
    * courseType: 课程类型， 0 体验课 1 正式课
    * quantity: 当前计量单位下的量值。总时间 = unit * quantity
    * studentName: 学员姓名
    * sellType: 售卖类型 1 按课时 2 按时间段 3 按期 4 自定义
    * studentLessonNo: 学员课表编号
    * signInStatus: 签到状态 0 未签到 1 到课 2 请假 3 旷课 4 课程已到期 5 课时不足 6 课时未生效
    * studentId: 学员id
    * unit: 时间单位
    **/
    student: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isSelected: false,
      isShowActionSheet: false,
      showChangeAction: false,
      isShowStudiedAsset: false,
      isShowAvailableAsset: false,
      actions: [
        {
          type: 'post',
          name: '点评',
        },
        {
          type: 'not-arrived',
          name: '未到',
        },
        {
          type: 'leave',
          name: '请假',
        },
        {
          type: 'remove',
          name: '移除学员',
          className: 'action-text--red',
        },
      ],
      changeActions: [
        {
          type: 'sign-in',
          name: '签到',
        },
        {
          type: 'not-arrived',
          name: '未到',
        },
        {
          type: 'leave',
          name: '请假',
        },
      ],
    };
  },
  computed: {
    validityTime() {
      const student = this.student;
      if (student.assetValidityType === 0) {
        return '永久有效';
      } else if (student.assetEndTime) { // 有到期日，就显示到期日
        return format(student.assetEndTime, 'YYYY-MM-DD');
      } else if (!student.assetEndTime && (student.assetValidityType === 2 || student.assetValidityType === 3)) { // 没有到期日，且按签到生效，则显示有效期（30天，1个月）
        return `${student.quantity}${student.unit}有效`;
      }

      return '';
    },
  },
  created() {
    this.initEvent();
    this.isShowStudiedAsset = this.parseStudiedAsset();
    this.isShowAvailableAsset = this.parseAvailableAsset();
  },
  methods: {
    initEvent() {
      this.$bus.$on('selectAllAction', (type) => {
        this.onSelectStudent(type);
      });
      this.$bus.$on('resetState', () => {
        this.isSelected = this.student.isSelected = false;
      });
    },
    // 点击选择按钮
    onSelectStudent(type) {
      const { student } = this;
      // if (!student.info.isShowActionBtn) { // 如果按钮是disable的，直接返回
      //   return;
      // }
      const SELECT_TYPE = {
        'no-select': false,
        'select': true,
      };
      this.isSelected = student.isSelected = SELECT_TYPE[type];
      this.$bus.$emit('updateStudentSelect', student);
      this.$bus.$emit('checkSelectAll');
    },
    // 签到，未到，请假，点评
    onSignInAction(type, isChange = false) {
      if (type === 'remove') {
        this.onRemove();
        return;
      }

      if (type === 'post') {
        this.onPost();
        return;
      }

      // 关闭 更多的popup
      this.onCancelActionSheet();
      this.onCancelChangeAction();

      if (isChange) {
        this.changeSignIn(type);
      } else {
        signInFn({
          props: {
            students: [this.student],
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
      }
    },

    // 改变签到状态(支持连锁)
    changeSignIn(type) {
      signIn.ChangeSignInState({
        signInType: SIGN_IN_TYPE[type],
        studentLessonNo: this.student.studentLessonNo,
        kdtId: this.kdtId,
      }).then(res => {
        this.showChangeAction = false;
        this.$bus.$emit('updateStudentList');
      }).catch(msg => {
        this.showChangeAction = false;
        this.$bus.$emit('updateStudentList');
        Toast(msg || '更改签到状态失败');
      });
    },

    // 发送ajax(支持连锁)
    sendSignIn(type) {
      signIn.SignIn({
        lessonNo: this.lessonNo,
        signInType: SIGN_IN_TYPE[type],
        signInAllStudents: false,
        studentLessonNos: [this.student.studentLessonNo],
        kdtId: this.kdtId,
      }).then(res => {
        const taskNo = res;
        this.getActionResult(taskNo, type, this.kdtId);
        this.isShowActionSheet = false;
      }).catch(msg => {
        this.isShowActionSheet = false;
        this.$bus.$emit('updateStudentList');
        Toast(msg || '签到失败');
      });
    },
    // 更多操作
    onMore() {
      this.isShowActionSheet = true;
    },
    onChange() {
      this.showChangeAction = true;
    },
    onRemove() {
      Dialog.confirm({
        title: `确定“${this.student.studentName}”学员？`,
        message: '移除后归还学员的课时；如果是预约上课的，会取消学员的预约',
      }).then(() => {
        this.$emit('remove');
        this.isShowActionSheet = false;
      }).catch(() => {});
    },
    onCancelActionSheet() {
      this.isShowActionSheet = false;
    },
    onSelectActionSheet(item) {
      this.onSignInAction(item.type);
    },
    onCancelChangeAction() {
      this.showChangeAction = false;
    },
    onSelectChangeAction(item) {
      this.onSignInAction(item.type, true);
    },
    parseStudiedAsset() {
      const student = this.student;
      return !(student.studied === null || student.studied === undefined) && student.sellType === 1;
    },
    parseAvailableAsset() {
      const student = this.student;
      return !(student.availableAsset === null || student.availableAsset === undefined) && student.sellType === 1;
    },

    // 点评
    onPost() {
      console.log('点评跳转');
      log.logCreateMoments();
      const student = this.student;
      try {
        const studentsSessionCache = {
          list: [{ name: student.studentName, id: student.studentId }],
          excludeIds: [],
          isSelectedAll: false,
          selectedCount: 1,
        };

        SessionStorage.setItem('vis__miniprogram__moments__students', JSON.stringify(studentsSessionCache));
      } catch (error) {
      }

      const location = Args.add('/v4/vis/h5/edu/moments/post-edit', {
        useSessionOfStudents: 1,
        pageFrom: 1,
        kdtId: this.kdtId,
        lessonNo: this.lessonNo,
        onlyOneStudent: 1,
        redirectUrl: encodeURIComponent(window.location.href),
      });

      this.isShowActionSheet = false;

      window.location.href = location;
    },
  },
};
</script>

<style lang="scss" scoped>
.student-item {
  display: flex;
  position: relative;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
  .select {
    display: block;
    margin-right: 7px;
    padding-top: 4px;
    width: 22px;
    .check-empty {
      display: block;
      width: 18px;
      height: 18px;
      line-height: 26px;
      border: 1px solid #e0e0e0;
      border-radius: 9px;
      &-disable {
        background-color: #f7f8fa;
      }
    }
  }
  .student-info {
    display: block;
    .name {
      display: block;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      line-height: 26px;
    }
    .text {
      display: block;
      font-size: 13px;
      line-height: 26px;
      color: #333;
      > span:first-child {
        display: inline-block;
        margin-right: 6px;
        width: 60px;
        color: #969799;
      }
    }
  }

  .signIn-disable {
    position: absolute;
    top: 16px;
    right: 0;
    font-size: 14px;
    color: #969799;
  }

  .course-info {
    position: absolute;
    right: 0;
    bottom: 16px;
    .btn {
      display: inline-block;
      margin: 0 0 0 8px;
      padding: 5px 21px;
      font-size: 14px;
      line-height: 1;
      text-align: center;
      border-radius: 13px;
      text-decoration: none;

      &-more {
        border: 1px solid #00b389;
        color: #00b389;
        background-color: #fff;
      }

      &-signIn {
        color: #fff;
        background-color: #00b389;
      }

      &-change {
        padding: 5px 7px;

        &--signined {
          border: 1px solid #00b389;
          color: #00b389;
          background-color: #fff;
        }
      }

      &-post {
        color: #fff;
        background-color: #00b389;
      }
    }
  }

  .action-text--red {
    color: #f44;
  }
}
</style>
