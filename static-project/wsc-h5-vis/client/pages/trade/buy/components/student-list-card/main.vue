<template>
  <card title="学员信息">
    <card-cell
      class="student-list-cell"
      title="学员"
      tip="选择上课学员"
      :value="value"
      :is-editable="isEditable"
      @click="onClickCell"
    />
  </card>
</template>

<script>
import { find, noop } from 'lodash';
import {
  redircetToEdit,
  getStudentIdFromCache,
  setStudentIdToCache,
  checkStudentIsCompleted,
} from './utils';

import { Card, CardCell } from '@/pages/trade/buy/components/card';
import { openStudentListPopup } from './components/student-list-popup';

export default {
  name: 'student-list-card',

  components: {
    Card,
    CardCell,
  },

  props: {
    getStudentList: {
      type: Function,
      default: () => Promise.resolve([]),
    },

    chosenStudent: {
      type: Object,
      default: () => ({}),
    },

    isEditable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    value() {
      const { name, mobile } = this.chosenStudent;
      return name ? name + ' ' + mobile : '';
    },
  },

  mounted() {
    this.getStudentList()
      .then(studentList => {
        const studentId = getStudentIdFromCache();
        if (!studentId) return;

        const student = find(studentList, student => student.id === studentId);
        if (!student) return;
        // 学员信息完整 && 是否存在班级检查
        if (
          checkStudentIsCompleted(student.customAttributeItems) &&
          !student.classId
        ) {
          this.$emit('change', student);
        }
      })
      .catch(noop);
  },

  methods: {
    getStudentListWithHandle() {
      return this.getStudentList()
        .then(studentList => {
          if (studentList.length === 0) {
            redircetToEdit();
            return;
          }
          return studentList;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          redircetToEdit();
        });
    },

    onClickCell() {
      const self = this;

      this.getStudentListWithHandle().then(studentList => {
        if (!studentList) return;

        openStudentListPopup({
          props: {
            studentList,
            chosenStudentId: this.chosenStudent.id,
          },
        }).then(student => {
          self.$emit('change', student);
          setStudentIdToCache(student.id);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.student-list-cell {
  .vis-biz-card-cell__value {
    font-weight: normal;
  }
}
</style>
