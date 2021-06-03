import { useAssignmentModuleModel } from '../../model';
import { useAppModel } from '../../../../App.model';

const HomeworkDetailBlockModel = () => {
  const {
    mainColor,
  } = useAppModel();

  const {
    homeworkDetailInfo,
    loaded,
  } = useAssignmentModuleModel();

  return {
    mainColor,

    homeworkDetailInfo,
    loaded,
  };
};

export default HomeworkDetailBlockModel;
