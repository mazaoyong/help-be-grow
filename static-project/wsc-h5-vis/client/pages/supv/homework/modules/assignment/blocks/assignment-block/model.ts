import { computed, ref } from '@youzan/tany-vue';
import { useAssignmentModuleModel } from '../../model';
import { assignmentRoute } from '../../../../router';

const AssignmentBlockModel = () => {
  const {
    assignmentInfo,
    assignmentId,
    studentId,
    isSelfHomework,
    loaded,
  } = useAssignmentModuleModel();

  const showWriteHomeworkPopup = ref(false);
  const setShowWriteHomeworkPopup = (v: boolean) => {
    showWriteHomeworkPopup.value = v;
  };
  const isOvertime = computed(() => {
    if (assignmentInfo.deadline && assignmentInfo.deadline < new Date()) {
      return true;
    }
    return false;
  });

  const setSubmit = () => {
    assignmentRoute.redirectTo({
      query: {
        assignmentId: assignmentId.value,
        studentId: studentId.value,
        kdt_id: assignmentInfo.targetKdtId,
      },
    });
  };

  return {
    assignmentInfo,
    showWriteHomeworkPopup,
    setShowWriteHomeworkPopup,
    assignmentId,
    studentId,
    isSelfHomework,
    isOvertime,
    setSubmit,
    loaded,
  };
};

export default AssignmentBlockModel;
