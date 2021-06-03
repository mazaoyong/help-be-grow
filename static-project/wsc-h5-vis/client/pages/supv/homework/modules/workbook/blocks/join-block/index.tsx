import { createBlock, ModelOf } from '@youzan/tany-vue';
import JoinBlockModel from './model';

import { Button } from 'vant';
import WorkbookCover from '../../../../components/workbook-cover';
import AwardRulePopup from '../../../../components/award-rule-popup';
import './style.scss';

function JoinBlock(model: ModelOf<typeof JoinBlockModel>) {
  const {
    mainColor,
    title,
    handleJoinWorkbook,
    joinButtonText,
  } = model;

  return (
    <div class="join-block">
      <WorkbookCover title={title.value}/>
      <div class="join-block__title-wrapper">
        <p class="join-block__title">{ title.value }</p>
      </div>
      <Button class="join-block__button" color={mainColor} round onClick={handleJoinWorkbook}>{ joinButtonText.value }</Button>
      <AwardRulePopup />
    </div>
  )
}

export default createBlock({
  model: JoinBlockModel,
  root: JoinBlock
})