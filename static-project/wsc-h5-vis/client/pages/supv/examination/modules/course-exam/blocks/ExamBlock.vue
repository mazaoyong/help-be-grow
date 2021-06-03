<template>
  <div v-tab="tab" class="block-exam">
    <info-block
      v-if="showBlock"
      :title="`可参加考试 (${examInfo.totalExamCount})`"
      more-text="查看全部"
      :has-more="examInfo.totalExamCount > 1"
      @click="showList"
    >
      <goods-card
        class="block-exam-item"
        :alias="examInfo.alias"
        :owl-type="examInfo.owlType"
        :media-type="examInfo.mediaType"
        :img="examInfo.cover"
        :title="examInfo.title"
        button-text="去考试"
        @click="onClickExam(examInfo.examId)"
      >
        <div class="block-exam-item__infos">
          <span
            v-for="info in getInfoList(examInfo)"
            :key="info"
            class="block-exam-item__info"
          >
            {{ info }}
          </span>
        </div>
      </goods-card>
    </info-block>

    <exam-popup v-model="showPopup" :alias="alias" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import GoodsCard from '@/components/goods-card';
import InfoBlock from '@/pages/course/detail/components/info-block';
import { redirect } from '@/common/utils/custom-safe-link';
import store from '../store';
import ExamPopup from './ExamPopup';

export default {
  name: 'exam-block',

  components: {
    InfoBlock,
    GoodsCard,
    ExamPopup,
  },

  data() {
    return {
      showPopup: false,
    };
  },

  computed: {
    ...mapState({
      hasExam: state => state.courseExam.hasExam,
      examInfo: state => state.courseExam.examInfo,
    }),

    tab() {
      if (this.$store.getters.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    showBlock() {
      return this.isOwnAsset && this.hasExam;
    },
    isOwnAsset() {
      return this.$store.state.goodsData.isOwnAsset;
    },
    alias() {
      return this.$store.state.goodsData.alias;
    },
  },

  beforeCreate() {
    this.$store.registerModule('courseExam', store);
  },

  created() {
    this.fetchCourseExam(this.alias);
  },

  methods: {
    ...mapActions([
      'fetchCourseExam',
    ]),

    showList() {
      this.showPopup = true;
    },

    getInfoList(exam) {
      let list = [];
      list.push(exam.duringSeconds === -1
        ? '不限时' : `${exam.duringSeconds < 60 ? 1 : exam.duringSeconds / 60}分钟`);

      if (exam.questionCount) list.push(`${exam.questionCount}题`);
      if (exam.totalScore) list.push(`${exam.totalScore / 100}分`);

      return list;
    },

    onClickExam(examId) {
      redirect({
        url: 'https://h5.youzan.com/wscvis/supv/examination/detail',
        query: {
          examId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.block-exam {
  margin-bottom: 8px;

  &-item {
    &__info {
      padding: 0 4px;
      font-size: 12px;
      line-height: 20px;
      color: #969799;
      border-left: 1px solid #ebedf0;

      &:first-child {
        border: none;
      }
    }
  }
}
</style>
