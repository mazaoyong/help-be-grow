<template>
  <div class="experience-course-item">
    <div class="header">
      <span class="name">{{ name }}</span>
      <span class="status">{{ statusText }}</span>
    </div>
    <div class="body">
      <div v-if="startTime" class="content-item">
        <span class="left">上课时间</span>
        <span class="right right-one-line">{{ startTime | formatTime }}</span>
      </div>
      <div v-if="addressName" class="content-item">
        <span class="left">上课地点</span>
        <span class="right right-one-line">{{ addressName }}</span>
      </div>
      <div v-if="sourceText" class="content-item">
        <span class="left">来源</span>
        <span class="right right-one-line">{{ sourceText }}</span>
      </div>
    </div>
    <div class="footer">
      <van-button
        v-if="(status === 1 || status === 2) && canOperate && checkAccess('教务-预约管理', '取消预约') && !isEduHqStore"
        class="delete-btn"
        plain
        round
        hairline
        type="primary"
        @click="onCancelAppointment"
      >
        取消
      </van-button>
      <van-button
        v-if="status === 2 && canOperate && checkAccess('教务-预约管理', '新建、修改、确认预约') && !isEduHqStore"
        class="delete-btn"
        plain
        round
        hairline
        type="primary"
        @click="onEditAppointment"
      >
        修改
      </van-button>
      <van-button
        v-if="status === 1 && canOperate && checkAccess('教务-预约管理', '新建、修改、确认预约') && !isEduHqStore"
        class="confirm-btn"
        round
        type="primary"
        @click="onConfirmAppointment"
      >
        确认
      </van-button>
      <van-button
        v-if="status === 2 && canOperate && checkAccess('教务-排课', '编辑') "
        class="signIn-btn"
        round
        type="primary"
        @click="onSignIn"
      >
        签到
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button, Toast, Dialog } from 'vant';
import { isEduHqStore } from '@youzan/utils-shop';
import { format } from 'date-fns';
import { TimingTask } from 'utils';
import { signIn } from 'pages-api';
import signInFn from 'components/sign-in';
import { checkAccess } from 'utils/permission';

const statusArr = ['', '待确认', '待上课', '履约中', '已签到', '已取消', '未到', '请假'];
const sourceArr = ['', '', '线上预约', '手动录入'];

export default {
  name: 'experience-course-item',
  components: {
    'van-button': Button
  },
  filters: {
    formatTime(time) {
      return format(time, 'YYYY-MM-DD HH:mm');
    }
  },
  props: {
    name: {
      type: String,
      default: '-'
    },
    status: { // 1 待确认 2 待履约 3 履约中 4 已完成 5 已取消
      type: Number,
      default: 1
    },
    startTime: {
      type: Number,
      default: 0
    },
    addressName: {
      type: String,
      default: ''
    },
    lessonNo: {
      type: String,
      default: ''
    },
    studentNo: {
      type: [String, Number],
      default: ''
    },
    studentLessonNo: {
      type: String,
      default: ''
    },
    source: {
      type: Number, // 2 线上预约 3 手动录入
      default: 2
    },
    kdtId: {
      type: [Number, String],
      default: 0
    },
    canOperate: { // 是否可操作资产
      type: Boolean,
      default: false
    },
    clueId: {
      type: Number,
      default: 0
    },
    studentName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statusText: statusArr[this.status],
      sourceText: sourceArr[this.source],
      isEduHqStore
    };
  },
  watch: {
    status(val) {
      this.statusText = statusArr[val];
    }
  },
  methods: {
    checkAccess,
    onCancelAppointment() {
      Dialog.confirm({
        title: '确定取消预约吗？'
      }).then(() => {
        this.cancelAppointment();
      }).catch(() => {});
    },
    cancelAppointment() {
      const { studentLessonNo } = this;
      this.$store.dispatch('clueDetailModule/cancelAppointment', { studentLessonNo })
        .then(() => {
          this.$emit('refresh');
        })
        .catch(err => {
          Toast(err);
        });
    },
    onConfirmAppointment() {
      window.location.href = `/v4/vis/h5/edu/book-listen?studentId=${this.studentNo}&studentLessonNo=${this.studentLessonNo}&studentLessonStatus=${this.status}&type=confirm-try`;
    },
    onEditAppointment() {
      window.location.href = `/v4/vis/h5/edu/book-listen?studentId=${this.studentNo}&studentLessonNo=${this.studentLessonNo}&studentLessonStatus=${this.status}&type=edit-try`;
    },
    onSignIn() {
      signInFn({
        props: {
          students: [{ studentLessonNo: this.studentLessonNo, studentName: this.studentName }],
          type: 'sign-in',
          kdtId: this.kdtId,
          startTime: this.startTime,
          signInAllStudents: false,
          lessonNo: this.lessonNo
        }
      })
        .then(() => {
          this.$emit('refresh');
        });

      // this.$store.dispatch('clueDetailModule/signIn', {
      //   lessonNo: this.lessonNo,
      //   signInType: 0,
      //   signInAllStudents: false,
      //   studentLessonNos: [this.studentLessonNo],
      //   kdtId: this.kdtId,
      // })
      //   .then(res => {
      //     const taskNo = res;
      //     this.getActionResult(taskNo);
      //   })
      //   .catch(err => {
      //     Toast(err);
      //   });
    },
    getActionResult(taskNo) {
      // 签到分为两个阶段：0～3秒无toast提示，3～10秒有toast提示，因此分为两个定时任务
      // 第一个定时任务，0～3秒内签到完成则直接返回
      const timingTask1 = new TimingTask(3000);
      timingTask1.start(() => {
        signIn.GetActionResult({
          taskNo,
          kdtId: this.kdtId
        }).then(res => {
          if (res.actionStatus === 1) { // 执行成功
            timingTask1.stop();
            Toast('签到完成');
            this.$emit('refresh');
          } else if (res.actionStatus === -1) { // 执行失败
            timingTask1.stop();
            Toast(res.globalActionMsg);
            this.$emit('refresh');
          }
        });
      }).catch(() => { // 超时捕获
        // 第一个定时任务，3～10秒内签到，有toast提示
        Toast({
          message: '正在签到中',
          duration: 0
        });
        const timingTask2 = new TimingTask(7000);
        timingTask2.start(() => {
          signIn.GetActionResult({
            taskNo,
            kdtId: this.kdtId
          }).then(res => {
            if (res.actionStatus === 1) { // 执行成功
              timingTask2.stop();
              Toast.clear();
              Toast('签到完成');
              this.$emit('refresh');
            } else if (res.actionStatus === -1) { // 执行失败
              timingTask2.stop();
              Toast.clear();
              Toast(res.globalActionMsg);
              this.$emit('refresh');
            }
          });
        }).catch(() => { // 超时捕获
          Toast.clear();
          this.$emit('refresh');
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.experience-course-item {
  margin: 0 15px;
  padding-bottom: 15px;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  &::after {
    display: block;
    content: '';
    height: 0;
    clear: both;
  }
  .header {
    height: 54px;
    clear: both;
    .name {
      display: block;
      float: left;
      height: 54px;
      line-height: 54px;
      font-size: 16px;
      font-weight: bold;
      color: #323233;
    }
    .status {
      display: block;
      float: right;
      height: 54px;
      line-height: 54px;
      font-size: 13px;
      color: #323233;
    }
  }
  .body {
    .content-item {
      display: flex;
      margin-bottom: 10px;
      .left {
        display: block;
        margin-right: 10px;
        width: 92px;
        font-size: 13px;
        color: #969799;
      }
      .right {
        display: block;
        flex: 1;
        flex-wrap: wrap;
        font-size: 13px;
        color: #323233;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
  }
  .footer {
    float: right;
    .delete-btn {
      height: 26px;
      line-height: 1;
      padding: 0 14px;
      border: 1px solid #f2f2f2;
      color: #646566;
      margin-left: 10px;
    }
    .confirm-btn, .signIn-btn {
      margin-left: 10px;
      height: 26px;
      line-height: 1;
      padding: 0 14px;
      background-color: #00b389;
      color: #fff;
    }
  }
}
</style>
