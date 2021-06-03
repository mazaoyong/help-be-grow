<template>
  <student-list-card
    v-if="isNeedStudent"
    v-log:click.inner="{
      '.student-list-cell': {
        ei: 'edu_click_btn',
        en: '教育下单点击页面按钮',
        pt: 'trade',
        params: {
          btn_name: 'edu_student_cell'
        }
      },
    }"
    :is-editable="!isOrderCreated"
    :get-student-list="getStudentList"
    :chosen-student="chosenStudent"
    :is-refresh="student.isNeedRefresh"
    @change="onChangeStudent"
  />
</template>

<script>
import { StudentListCard } from '@/pages/trade/buy/components/student-list-card';

export default {
  name: 'student-block',

  components: {
    StudentListCard,
  },

  state: ['student'],

  getters: ['isOrderCreated', 'chosenStudent', 'isNeedStudent'],

  methods: {
    getStudentList() {
      return this.$dispatch('GET_STUDENT_LIST');
    },

    onChangeStudent(student) {
      this.$commit('SET_CHOSEN_STUDENT', student);
    },
  },
};
</script>
