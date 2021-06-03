import { computed, ref } from '@youzan/tany-vue';
import Assignment from 'domain/supv/homework/entities/Assignment';
import {
  fetchAssignment as fetchAssignmentService,
  fetchAssignmentSiblings as fetchAssignmentSiblingsService,
} from 'domain/supv/homework/services/assignment';
import { useAppModel } from '../../../App.model';

const AssignmentListModel = () => {
  const {
    reviewPageData,
    setReviewPageData,
  } = useAppModel();

  const isSelected = reviewPageData['isSelected'];
  setReviewPageData('isSelected', false);
  const isReviewed = reviewPageData['isReviewed'];
  setReviewPageData('isReviewed', false);

  const total = reviewPageData['total'];
  const initialList = ' '.repeat(total)
    .split('').map(() => ({ loaded: false, assignment: {} as Assignment }));

  const isFetching = ref(false);
  const assignmentList = ref(initialList);
  const currentIndex = ref(reviewPageData['currentIndex']);
  const currentAssignment = computed(() => assignmentList.value[currentIndex.value]?.assignment);
  const nextId = ref(0);
  const hasNext = computed(() => {
    return !isFetching.value && currentIndex.value < assignmentList.value.length - 1 && !!nextId.value;
  });
  const prevId = ref(0);
  const hasPrev = computed(() => {
    return !isFetching.value && currentIndex.value > 0 && !!prevId.value;
  });
  const handlePrev = () => {
    currentIndex.value -= 1;
    fetchAssignmentAndSiblings(prevId.value, currentIndex.value);
  };
  const handleNext = () => {
    currentIndex.value += 1;
    fetchAssignmentAndSiblings(nextId.value, currentIndex.value);
  };
  const hasReviewed = computed(() => currentAssignment.value?.hasReviewed || false);

  // 获取学生作业
  const refreshCurrent = () => {
    fetchAssignment(currentAssignment.value.id, currentIndex.value);
  };
  const fetchAssignment = (assignmentId: number, index: number) => {
    return fetchAssignmentService(
      assignmentId,
    )
      .then(res => {
        console.log('获取到学生作业详情：', res);
        if (res) {
          assignmentList.value.splice(index, 1, {
            loaded: true,
            assignment: res.assignment,
          });
        }
      });
  };
  const fetchAssignmentAndSiblings = async (assignmentId: number, index: number) => {
    if (isFetching.value) return;
    isFetching.value = true;

    await fetchAssignment(assignmentId, index);

    if (currentAssignment.value) {
      const res = await fetchAssignmentSiblingsService({
        assignmentId,
        exerciseBookId: currentAssignment.value?.workbook?.id,
        orderBy: 'submit_time',
        excellentScore: isSelected ? 1 : 0,
        status: isReviewed ? 2 : 1,
        channel: isSelected ? 3 : 2, // 来源 3 是优秀作业
        homeworkId: currentAssignment.value?.homework?.id,
      });

      if (res) {
        if (isSelected) {
          nextId.value = Number(res.excellentNextId);
          prevId.value = Number(res.excellentPrevId);
        } else if (isReviewed) {
          nextId.value = Number(res.viewNextAssignmentId);
          prevId.value = Number(res.viewPrevAssignmentId);
        } else {
          nextId.value = Number(res.reviewNextAssignmentId);
          prevId.value = Number(res.reviewPrevAssignmentId);
        }
      }
    }

    isFetching.value = false;
  };

  return {
    isSelected,
    assignmentList,
    currentAssignment,
    hasReviewed,
    hasPrev,
    hasNext,
    currentIndex,
    handlePrev,
    handleNext,
    refreshCurrent,
    fetchAssignment,
    fetchAssignmentAndSiblings,
  };
};

export default AssignmentListModel;
