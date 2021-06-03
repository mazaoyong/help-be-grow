import { Button as VanButton } from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import BottomActionsModel from './model';
import './style';

function BottomActions(model: ModelOf<typeof BottomActionsModel>) {
  return (
    <div class="block-bottom-actions">
      {
        model.hasReviewed.value
          ? [
            <VanButton
              class="block-bottom-actions__btn-edit"
              disabled={!model.hasAuthorized.value}
              color={model.hasAuthorized.value ? '#00b389' : '#969799'}
              plain
              round
              block
              onClick={model.openReviewPopup}
            >
              修改评语
            </VanButton>,
            <VanButton color="#00b389" round block onClick={model.openShareCard}>
              分享作业
            </VanButton>
          ]
          : [
            <VanButton
              class="block-bottom-actions__btn-edit"
              disabled={!model.hasAuthorized.value}
              block
              round
              plain={!model.hasAuthorized.value}
              color={model.hasAuthorized.value ? '#00b389' : '#969799'}
              onClick={model.openReviewPopup}
            >
              批阅作业
            </VanButton>
          ]
      }
    </div>
  );
}

export default createBlock({
  root: BottomActions,
  model: BottomActionsModel,
});
