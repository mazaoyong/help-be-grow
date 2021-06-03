import {
  Cell as VanCell,
  CellGroup as VanCellGroup,
  Icon as VanIcon,
  Switch as VanSwitch,
  Popup as VanPopup,
  DatetimePicker as VanDatetimePicker,
  ActionSheet as VanActionSheet,
} from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import SettingsModel from './model';
import './style.scss';

function Settings(model: ModelOf<typeof SettingsModel>) {
  const datePicker = model.datePicker.value;
  const actionSheet = model.actionSheet.value;

  return (
    <div class="block-settings">
      <VanCellGroup class="card">
        <VanCell title="定时发布">
          <VanSwitch
            slot="right-icon"
            disabled={model.disabled.value}
            value={Boolean(model.publishSettings?.enableTimer)}
            size="24"
            onChange={model.setPublishType}
            activeColor="#00b389"
          />
        </VanCell>
        {
          model.ifShowPublishAtCell(
            <VanCell
              class={model.disabled.value ? 'cell--disabled' : ''}
              title="发布时间"
              value-class={model.showPublishTimeErrorMsg.value
                ? 'cell--has-error'
                : model.publishSettings?.publishTime ? 'cell--has-value' : ''
              }
              value={model.showPublishTimeErrorMsg.value
                ? model.publishTimeErrMsg.value : model.publishAtValue.value
              }
              isLink
              onClick={
                model.disabled.value
                  ? () => {}
                  : () => model.openDatePickerPopup('publishAt')
              }
            />
          )
        }
        <VanCell
          title="截止时间"
          value-class={model.publishSettings?.endTime ? 'cell--has-value' : ''}
          isLink
          onClick={() => model.openDatePickerPopup('endAt')}
        >
          {
            model.publishSettings?.endTime
              ? (
                <VanIcon
                  slot="right-icon"
                  name="cross"
                  size="14px"
                  color="#969799"
                  onClick={model.clearEndAt}
                />
              )
              : null
          }

          <div>
            <span>
              {model.endAtValue.value}
            </span>
          </div>
        </VanCell>

        <VanPopup
          value={model.showDatePickerPopup.value}
          position="bottom"
          closeOnClickOverlay={false}
          onClose={model.closeDatePickerPopup}
        >
          <VanDatetimePicker
            value={datePicker.currentDate}
            type="datetime"
            title="选择时间"
            minDate={datePicker.minDate}
            onInput={datePicker.setCurrentDate}
            onCancel={model.closeDatePickerPopup}
            onConfirm={datePicker.confirmPickDate}
          />
        </VanPopup>
      </VanCellGroup>

      <VanCellGroup class="card">
        <VanCell
          class={model.disabled.value ? 'cell--disabled' : ''}
          title="评分机制"
          value-class="cell--has-value"
          value={model.scoreTypeValue.value}
          isLink
          onClick={
            model.disabled.value
              ? () => {}
              : () => model.openActionSheet('type')
          }
        />
        {
          model.ifShowRuleCell(
            <VanCell
              class={model.disabled.value ? 'cell--disabled' : ''}
              title="计分规则"
              value-class="cell--has-value"
              value={model.scoreRuleValue.value}
              isLink
              onClick={
                model.disabled.value
                  ? () => {}
                  : () => model.openActionSheet('rule')
              }
            />
          )
        }
        <VanActionSheet
          value={model.showActionSheet.value}
          actions={actionSheet.options}
          cancelText="取消"
          description={actionSheet.title}
          closeOnClickAction
          closeOnClickOverlay={false}
          onSelect={actionSheet.onSelect}
          onCancel={model.closeActionSheet}
        />
      </VanCellGroup>
    </div>
  );
};

export default createBlock({
  model: SettingsModel,
  root: Settings
});
