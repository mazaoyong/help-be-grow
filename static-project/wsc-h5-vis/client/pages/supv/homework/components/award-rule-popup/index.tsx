import { createComponent } from '@youzan/tany-vue';
import { Popup } from '@youzan/vis-ui';
import AwardRulePopupModel, { IAwardRulePopupModel } from './model';
import './style.scss';

function AwardRulePopup(model: IAwardRulePopupModel) {
  const { reward, visible, setVisible } = model;
  return (
    reward.value.length > 0 && (
      <div class="award-rule__wrapper">
        <p class="award-rule__text" onClick={() => setVisible(true)}>
          作业奖励
        </p>
        <Popup
          value={visible.value}
          title="作业奖励规则"
          closeable
          closeOnClickOverlay
          closeOnPopstate
          safe-area-inset-bottom
          style={{ height: '230px' }}
          onInput={(val: boolean) => setVisible(val)}
        >
          <ul class="award-rule__content">
            {reward.value.map((item: any) => (
              <li key={item.awardNode + item.type} class="award-rule__line">
                <label>{item.labelText}</label>
                <span>
                  送{item.awardAmount}{item.awardBizId}
                  {item.limitAmount ? `（每日上限${item.limitAmount}${item.awardBizId}）` : null}
                </span>
              </li>
            ))}
          </ul>
        </Popup>
      </div>
    )
  );
}

export default createComponent(AwardRulePopup, {
  model: AwardRulePopupModel,
});
