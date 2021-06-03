<template>
  <div class="exam-list">
    <vis-common-list
      :params="listParams"
      :request="getExamListWrap"
      immediate-check
      @error="onListError"
    >
      <goods-card
        slot-scope="props"
        :img="props.item.cover"
        :title="props.item.title"
        :button-text="getButtonText(props.item)"
        @click="onClickExam(props.item)"
      >
        <div class="exam-list-item__infos">
          <span
            v-for="info in getInfoList(props.item)"
            :key="info"
            class="exam-list-item__info"
          >
            {{ info }}
          </span>
        </div>
      </goods-card>

      <empty
        slot="empty"
        class="empty-block"
        :show-button="false"
        message="没有关联的考试"
      >
        <div slot="button" />
      </empty>
    </vis-common-list>
  </div>
</template>

<script>
import { get } from 'lodash';
import { Toast } from 'vant';
import { CommonList as VisCommonList } from '@youzan/vis-ui';
import Empty from 'components/error-message';
import GoodsCard from 'components/goods-card';
import { redirect } from '@/common/utils/custom-safe-link';
import { getCourseExamList } from '../apis';

export default {
  name: 'exam-list',

  components: {
    VisCommonList,
    Empty,
    GoodsCard,
  },

  props: {
    alias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      examList: [],
    };
  },

  computed: {
    listParams() {
      return {
        alias: this.alias || get(this, '$route.query.alias', ''),
        pageSize: 10,
      };
    },
  },

  methods: {
    getExamListWrap: (params) => {
      params.pageRequest = {
        pageSize: params.pageSize,
        pageNumber: params.page,
      };

      return getCourseExamList(params)
        .then(res => ({
          list: res.content,
          hasNext: params.page < res.totalPages,
        }));
    },

    onListError(errMsg) {
      Toast(errMsg || '获取考试列表失败');
    },

    onClickExam(exam) {
      const { examId, userExamId } = exam;
      let url = '';

      switch (exam.userExamState) {
        case 0:
          url = '/wscvis/supv/examination/detail';
          break;
        case 1:
          url = '/wscvis/supv/examination/answer/answer';
          break;
        case 2:
          url = '/wscvis/supv/examination/result';
          break;
        default:
      }
      redirect({
        url,
        query: {
          examId,
          userExamId,
        },
      });
    },

    getInfoList(exam) {
      let list = [];
      list.push(exam.duringSeconds === -1
        ? '不限时' : `${exam.duringSeconds < 60 ? 1 : exam.duringSeconds / 60}分钟`);

      if (exam.questionCount) list.push(`${exam.questionCount}题`);
      if (exam.totalScore) list.push(`${exam.totalScore / 100}分`);

      return list;
    },

    getButtonText(exam) {
      switch (exam.userExamState) {
        case 0:
          return '去考试';
        case 1:
          return '继续考试';
        case 2:
          return '查看成绩';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.exam-list {
  background: #fff;

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
