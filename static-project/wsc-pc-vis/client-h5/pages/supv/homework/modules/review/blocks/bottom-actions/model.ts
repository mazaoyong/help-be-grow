import { trigger } from '@youzan/tany-vue';
import { useRootModel } from '../../Root.model';
import { OPEN_REVIEW_POPUP, OPEN_SHARE_POPUP } from '../../events';
import { useAppModel } from '@/pages/supv/homework/App.model';

const BottomActionsModel = () => {
  const { hasAuthorized } = useAppModel();
  const { hasReviewed } = useRootModel();

  const openReviewPopup = () => trigger(OPEN_REVIEW_POPUP, '');
  const openShareCard = () => trigger(OPEN_SHARE_POPUP, '');

  return {
    hasAuthorized,
    hasReviewed,

    openReviewPopup,
    openShareCard,
  };
};

export default BottomActionsModel;
