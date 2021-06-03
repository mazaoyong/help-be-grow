<template>
  <vis-standard-popup
    :value="value"
    title="上课列表"
    closeable
    v-on="proxyListeners"
  >
    <vis-common-list
      :params="params"
      :request="requestLessonList"
      empty-class="check-v-lesson-list__empty"
      list-class="check-v-lesson-list"
    >
      <vis-info-card
        slot-scope="{item}"
        :title="item.lessonName"
        :subtitle="genTime(item.startTime, item.endTime)"
        :footer-list="genFooterList(item)"
        class="check-v-lesson-list__item"
      />
    </vis-common-list>
  </vis-standard-popup>
</template>

<script>
import { Popup, InfoCard, CommonList } from '@youzan/vis-ui';
import { findLittlePage } from '../../apis';
import format from 'date-fns/format';

export default {
  components: {
    'vis-standard-popup': Popup,
    'vis-info-card': InfoCard,
    'vis-common-list': CommonList,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
    assetNos: {
      type: Array,
      default() {
        return [];
      },
    },
    endTime: {
      type: Number,
      default: 0,
    },
    kdtId: {
      type: [String, Number],
      default: 0,
    },
  },

  data() {
    return {
      params: {
        kdtId: this.kdtId,
        assetNos: this.assetNos,
        endTime: this.endTime,
      },
    };
  },

  computed: {
  },

  methods: {
    requestLessonList: (params) => findLittlePage(params).then((res = {}) => {
      const list = res.content;
      return { list, hasNext: list.length === params.pageSize };
    }),
    genFooterList(conf) {
      return [
        { name: '冻结课时', value: conf.lockNum / 100, hidden: !conf.lockNum },
        { name: '上课教室', value: conf.classroomName, hidden: !conf.classroomName },
        { name: '老师', value: conf.teacherName, hidden: !conf.teacherName },
        { name: '学员', value: conf.studentName, hidden: !conf.studentName },
      ];
    },
    genTime(startTime, endTime) {
      const day = format(startTime, 'YYYY-MM-DD');
      const start = format(startTime, 'HH:mm');
      const end = format(endTime, 'HH:mm');
      return `${day}  ${start}-${end}`;
    },
  },
};
</script>

<style lang="scss">
  .check-v-lesson-list {
    overflow: hidden;
    background-color: #f7f8fA;

    &__empty {
      text-align: center;
    }

    &__item {
      margin-left: 12px;
      margin-right: 12px;
    }
  }
</style>
