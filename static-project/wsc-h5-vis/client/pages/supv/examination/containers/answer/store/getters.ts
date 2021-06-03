import { GetterTree } from 'vuex';
import { AnswerState } from './state';
import { ExamState } from 'supv/examination/store/state';

interface AnswerGetters extends GetterTree<AnswerState, ExamState> {
}

const getters: AnswerGetters = {
};

export default getters;
