import { get } from 'lodash';
// TODO 暂时先使用评价页面的数据处理
import { formatEvaluationData } from '@/pages/edu/course-evaluation/common/utils/formatData';
import { getEvaluate } from '../api';

export default {
  initEvaluate({ commit, rootState }) {
    getEvaluate(rootState.goodsData.alias).then(res => {
      commit('count', get(res, 'count', 0));
      commit('data', formatEvaluationData(get(res, 'lastEvaluation', [])));
    });
  },
};
