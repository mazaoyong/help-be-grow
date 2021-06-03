import { createAssignmentListApi } from 'domain/supv/homework/services/assignment';
import { REVIEW_STATUS } from 'domain/supv/homework/constants';
import { computed, ref } from '@youzan/tany-vue';
import { useRouter } from '@/pages/supv/homework/router';
import { useRootModel } from '../../Root.model';
import { useAppModel } from '@/pages/supv/homework/App.model';

const ListModel = () => {
  const { route } = useRouter();
  const { homeworkDetail } = useRootModel();
  const { setReviewPageData } = useAppModel();

  const reviewedTotal = computed(() => homeworkDetail.value.reviewedCount || 0);
  const reviewedTitle = computed(() => `已批阅 ${reviewedTotal.value}`);

  const unreviewedTotal = computed(() => homeworkDetail.value.unreviewedCount || 0);
  const unreviewedTitle = computed(() => `未批阅 ${unreviewedTotal.value}`);

  return {
    reviewedTotal,
    reviewedTitle,
    reviewedApi: createAssignmentListApi(
      route.value.params.homeworkId,
      REVIEW_STATUS.REVIEWED,
    ),

    unreviewedTotal,
    unreviewedTitle,
    unreviewedApi: createAssignmentListApi(
      route.value.params.homeworkId,
      REVIEW_STATUS.UNREVIEWED,
    ),

    homeworkDetail,
    setReviewPageData,
  };
};

export default ListModel;
