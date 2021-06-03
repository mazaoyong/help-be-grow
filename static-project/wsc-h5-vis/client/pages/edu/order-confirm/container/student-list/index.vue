<template>
  <div class="sl-bottomsheet-box">
    <div class="sl-bottomsheet-content">
      <template>
        <div
          class="sl-bottomsheet-content-add"
          @click="addStudent"
        >
          <span class="add-icon">
            +
          </span>
          <span class="add-text">
            新增学员
          </span>
        </div>
        <student-item
          v-for="(item, index) in studentList"
          :key="index"
          :source-data="item"
          :show-check="showCheckBtn"
          :checked="checkedOrder === index"
          @click-edit="clickItem(item.id)"
          @click-extra="clickItem(item.id)"
          class="sl-bottomsheet-content-panel nopadding"
          @click-check="confirmStudent"
        />
      </template>
    </div>
  </div>
</template>
<script>
/**
 * 这是一个学员列表组件，基本用法跟学员列表页面一致
 */
import StudentItem from '../../../student-list/components/StudentItem';
import * as SafeLink from '@youzan/safe-link';

const origin = 'https://h5.youzan.com';
const kdtId = _global.kdt_id || 0;

export default {
  name: 'student-list',

  components: {
    StudentItem,
  },

  props: {
    checkedStudent: [String, Number],
    showCheckBtn: {
      type: Boolean,
      default: true,
    },
    studentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      checkedOrder: null,
    };
  },

  watch: {
    checkedStudent(val, oldVal) {
      this.initCheckedStudent(val);
    },
  },

  mounted() {
    this.initCheckedStudent(this.checkedStudent);
  },

  methods: {
    // 添加学员
    addStudent() {
      SafeLink.redirect({
        url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${kdtId}&callback_url=${encodeURIComponent(window.location.href)}`,
        kdtId,
      });
    },

    // 选中学生之后跳转回页面
    confirmStudent(checked, sourceData) {
      if (checked) {
        const id = sourceData.id;
        this.checkedOrder = this.studentList.findIndex(item => item.id === id);
        this.$emit('confirmStudent', id);
      }
    },

    // 点击事件
    clickItem(alias) {
      SafeLink.redirect({
        url: `${origin}/wscvis/edu/student-edit.html?alias=${alias}&kdt_id=${kdtId}&callback_url=${encodeURIComponent(window.location.href)}`,
        kdtId,
      });
    },

    // 选中学员
    initCheckedStudent(val) {
      const { checkedStudent } = this;
      if (checkedStudent) {
        // 如果有默认选中的学生信息
        this.checkedOrder = this.studentList.findIndex(item => item.id === Number(val));
      }
    },
  },
};
</script>
<style lang="scss">
.sl-bottomsheet {

  &-content {
    position: relative;
    width: 100%;
    background-color: #fff;

    * {
      font-size: 14px;
    }

    &.loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -30px;
    }

    &-nav {
      width: 100%;
      height: 46px;
      padding: 0 20px;
      font-weight: 500;
      line-height: 46px;
      box-sizing: border-box;

      .right {
        float: right;
      }

      .close {
        font-size: 24px;
      }
    }

    &-add {
      box-sizing: border-box;
      position: relative;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #f2f2f2;
      .add-icon {
        box-sizing: border-box;
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        font-size: 37px;
        text-align: center;
        line-height: 45px;
        transform: scale(.4);
      }
      .add-text {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 47px;
        font-size: 14px;
      }
    }

    &-panel {
      margin: 0 15px;
      border-bottom: 1px solid #f2f2f2;

      &.nopadding {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
</style>
