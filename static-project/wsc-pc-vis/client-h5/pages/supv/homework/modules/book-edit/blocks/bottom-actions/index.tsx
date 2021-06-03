import { Button as VanButton } from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import BottomActionsModel from './model';
import './style.scss';

function BottomActions(model: ModelOf<typeof BottomActionsModel>) {
  return (
    <div class="fixed-bottom block-bottom-actions">
      <VanButton
        disabled={model.disabled.value}
        round
        block
        plain={model.disabled.value}
        onClick={model.submit}
      >
        发布作业
      </VanButton>
    </div>
  );
};

export default createBlock({
  model: BottomActionsModel,
  root: BottomActions,
});
