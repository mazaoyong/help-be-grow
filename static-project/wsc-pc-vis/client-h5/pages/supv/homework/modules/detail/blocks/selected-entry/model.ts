import { useAppModel } from '@/pages/supv/homework/App.model';
import { useRootModel } from '../../Root.model';

const BlockSelectedEntryModel = () => {
  const { setReviewPageData: setData } = useAppModel();
  const { homeworkDetail } = useRootModel();

  const setReviewPageData = () => {
    setData('isSelected', true);
    setData('total', homeworkDetail.value.selectedCount);
    setData('currentIndex', 0);
  };

  return {
    homeworkDetail,
    setReviewPageData,
  };
};

export default BlockSelectedEntryModel;
