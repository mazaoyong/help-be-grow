import { getCommentIcon } from 'supv/homework/utils';
import { useAssignmentModuleModel } from '../../model';

const CorrectBlockModel = () => {
  const {
    correctInfo,
    loaded,
  } = useAssignmentModuleModel();

  const commentIcon = getCommentIcon();
  return {
    correctInfo,
    commentIcon,
    loaded,
  };
};

export default CorrectBlockModel;
