import { ModelOf } from '@youzan/tany-vue';
import { useRootModel } from '../../Root.model';

const AssignmentListModel = () => {
  const {
    assignmentList,
    hasPrev,
    hasNext,
    showSelectedBg,
    currentIndex,
    handlePrev,
    handleNext,
  } = useRootModel();

  return {
    assignmentList,
    hasPrev,
    hasNext,
    showSelectedBg,
    currentIndex,
    handlePrev,
    handleNext,
  };
};

export type AssignmentListType = ModelOf<typeof AssignmentListModel>;
export default AssignmentListModel;
