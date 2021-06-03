<template>
  <div class="action-header">
    <a
      v-if="isBatch"
      href="javascript: void(0);"
    >
      <vis-icon
        v-if="isSelectAll"
        name="check"
        size="20px"
        color="#00b389"
        @click="onSelect('no-select')"
      />
      <span v-else-if="isCanSelectAll" class="check-empty" @click="onSelect('select')" />
      <span v-else class="check-empty check-empty-disable" />
      <span class="text-select-all">全选</span>
      <span class="text-select-num">(已选中: {{ selectedNum }})</span>
    </a>
    <a
      v-else-if="!isBatch && studentUncheckAmount > 0"
      href="javascript: void(0);"
      @click="onSignInAll"
    >
      待签到全部标记已签到
    </a>

    <div class="flex-item">
      <a
        v-if="!isBatch && !isTrial"
        class="add-btn"
        href="javascript: void(0);"
        @click="onStudentAdd"
      >
        添加学员
      </a>
      <a href="javascript: void(0);" @click="onBatchAction">
        {{ isBatch ? '取消操作': '批量操作' }}
      </a>
    </div>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
// import { Toast } from 'vant';
// import { signIn } from 'pages-api';
import signInFn from 'components/sign-in';
import mixin from '../mixin';

export default {
  name: 'action-header',
  components: {
    'vis-icon': Icon,
  },
  mixins: [mixin],
  props: {
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
    kdtId: {
      type: [Number, String],
      default: 0,
    },
    startTimeNum: {
      type: Number,
      default: 0,
    },
    studentUncheckAmount: {
      type: Number,
      default: 0,
    },
    isTrial: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isBatch: false,
      isCanSelectAll: true, // 是否可以全选
      isSelectAll: false, // 是否已经全选
      selectedNum: 0,
    };
  },
  created() {
    this.initEvent();
    this.isCanSelectAll = this.checkIsCanSelectAll();
  },
  methods: {
    initEvent() {
      this.$bus.$on('updateSelectAll', isSelectAll => {
        this.isSelectAll = isSelectAll;
      });
      this.$bus.$on('updateSelectedNum', studentList => {
        let num = 0;
        studentList.map(student => {
          if (student.isSelected) {
            num++;
          }
        });
        this.selectedNum = num;
      });
      this.$bus.$on('resetState', () => {
        this.isBatch = false;
        this.selectedNum = 0;
      });
    },
    // 待签到全部标记已签到
    onSignInAll() {
      signInFn({
        props: {
          students: [],
          type: 'sign-in',
          kdtId: this.kdtId,
          startTime: this.startTimeNum,
          signInAllStudents: true,
          lessonNo: this.lessonNo,
          signInAllStudentsNumber: this.studentUncheckAmount,
        },
      })
        .then(() => {
          this.$bus.$emit('updateStudentList');
        });
      // signIn.SignIn({
      //   lessonNo: this.lessonNo,
      //   signInType: 0,
      //   signInAllStudents: true,
      //   kdtId: this.kdtId,
      // }).then(res => {
      //   const taskNo = res;
      //   this.getActionResult(taskNo, 'sign-in', this.kdtId);
      // }).catch(msg => {
      //   Toast(msg || '批量签到失败');
      //   this.$bus.$emit('updateStudentList');
      // });
    },
    // 批量操作
    onBatchAction() {
      this.isBatch = !this.isBatch;
      if (this.isBatch) {
        this.isSelectAll = false;
      }
      this.$emit('batchAction', this.isBatch);
    },
    onSelect(type) {
      const SELECT_TYPE = {
        'no-select': false,
        'select': true,
      };
      this.isSelectAll = SELECT_TYPE[type];
      this.$bus.$emit('selectAllAction', type);
    },
    checkIsCanSelectAll() {
      let bool = false;
      this.studentList.map(student => {
        if (student.canSelect) {
          bool = true;
        }
      });
      return bool;
    },
    onStudentAdd() {
      this.$emit('go-add-student');
    },
  },
};
</script>

<style lang="scss" scoped>
.action-header {
  display: flex;
  margin: 0 0 15px 0;
  .vis-icon {
    vertical-align: middle;
    margin: 0 6px 0 0;
  }
  .check-empty {
    display: inline-block;
    margin: 0 8px 0 0;
    width: 18px;
    height: 18px;
    line-height: 26px;
    border: 1px solid #e0e0e0;
    border-radius: 9px;
    vertical-align: middle;
    &-disable {
      background-color: #f7f8fa;
    }
  }
  .text-select {
    &-all {
      display: inline-block;
      margin: 0 10px 0 0;
      font-size: 13px;
      color: #333;
      vertical-align: middle;
    }
    &-num {
      display: inline-block;
      font-size: 13px;
      color: #969799;
      line-height: 20px;
      vertical-align: middle;
    }
  }
  & > a, .flex-item {
    display: block;
    flex: 1;
    font-size: 13px;
    color: #00b389;

    &:first-child {
      text-align: left;
    }
    &:last-child {
      text-align: right;
    }

    .add-btn {
      margin-right: 10px;
    }
  }
}
</style>
