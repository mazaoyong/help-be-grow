import createStore from '@youzan/ebiz-state';
import { IQuestion } from '../../types';

interface IInitialStore {
  id: number;
  // 已参加考试的人数
  attendExamStudentCount: number;
  setting: any;
  questionList: IQuestion[];
}

const initialStore: IInitialStore = {
  id: 0,
  attendExamStudentCount: 0,
  setting: {},
  questionList: []
};

export default createStore(initialStore);
