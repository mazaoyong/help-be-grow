<template>
  <info-block
    v-if="teacherList.length"
    v-tab="{ index: 2, title: '主讲老师' }"
    class="teacher-list-block"
    :title="`主讲老师(${teacherList.length})`"
    :has-more="hasMore"
    @click="showPopup"
  >
    <teacher-item
      v-for="teacher in showTeacherList"
      :key="teacher.id"
      :data="teacher"
      :kdt-id="kdtId"
    />
  </info-block>
</template>

<script>
import InfoBlock from '@/pages/course/detail/components/info-block';
import TeacherItem from './components/teacher-item';
import openTeacherPop from './components/teacher-pop';

export default {
  components: {
    InfoBlock,
    TeacherItem,
  },

  data() {
    return {
      visible: false,
    };
  },

  rootState: ['goodsData', 'kdtId'],

  computed: {
    teacherList() {
      return this.goodsData.teacherList;
    },

    hasMore() {
      return this.teacherList.length > 3;
    },

    showTeacherList() {
      return this.teacherList.slice(0, 3);
    },
  },

  methods: {
    showPopup() {
      openTeacherPop(`主讲老师(${this.teacherList.length})`)({
        props: {
          teacherList: this.teacherList,
          kdtId: this.kdtId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.teacher-list-block {
  margin-bottom: 8px;
}
</style>
