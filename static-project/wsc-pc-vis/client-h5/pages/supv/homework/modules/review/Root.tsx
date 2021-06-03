import BlockAssignmentList from './blocks/assignment-list';
import BlockBottomActions from './blocks/bottom-actions';
import BlockReviewPopup from './blocks/review-popup';
import { RootModelType } from './Root.model';

function Root(model: RootModelType) {
  return model.showContent(
    <div class={ `module-review${model.showSelectedBg.value ? ' is-selected' : ''}`}>
      <BlockAssignmentList />
      <BlockBottomActions />
      <BlockReviewPopup />
    </div>
  );
};

export default Root;
