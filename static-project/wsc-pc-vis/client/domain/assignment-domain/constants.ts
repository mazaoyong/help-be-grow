import { StudentAssignmentSubmitStatus } from './types/assignment';

export const assignmentStatusMap = {
  [StudentAssignmentSubmitStatus.UNSUBMITTED]: '未提交',
  [StudentAssignmentSubmitStatus.AWAIT_MARKING]: '未批阅',
  [StudentAssignmentSubmitStatus.MARKED]: '已批阅',
};

export const assignmentOperationTextMap = {
  [StudentAssignmentSubmitStatus.UNSUBMITTED]: '-',
  [StudentAssignmentSubmitStatus.AWAIT_MARKING]: '批阅',
  [StudentAssignmentSubmitStatus.MARKED]: '查看',
};
