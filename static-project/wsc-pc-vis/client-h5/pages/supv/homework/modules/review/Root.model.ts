import { computed, hookOf, ModelOf, ref } from '@youzan/tany-vue';
import { useRouter } from '../../router';
import AssignmentListModel from './models/AssignmentList';
import SharePopupModel from './models/SharePopup';

const RootModel = () => {
  const { route } = useRouter();
  const assignmentListModel = AssignmentListModel();
  const {
    currentIndex,
    currentAssignment,
    fetchAssignmentAndSiblings,
  } = assignmentListModel;
  SharePopupModel(currentAssignment);

  // init
  const inited = ref(false);
  const init = async () => {
    try {
      await fetchAssignmentAndSiblings(
        Number(route.value.params.assignmentId),
        currentIndex.value,
      );
    } finally {
      inited.value = true;
    }
  }
  const showContent = (elem: JSX.Element) => {
    return inited.value ? elem : null;
  };
  const showSelectedBg = computed(
    () => currentAssignment.value?.selected
  );
  init();

  return {
    showContent,
    showSelectedBg,

    ...assignmentListModel,
  };
};

export type RootModelType = ModelOf<typeof RootModel>;
export const useRootModel = hookOf(RootModel);
export default RootModel;
