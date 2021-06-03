import { Pop } from '@zent/compat';
import React, { FC, useMemo, useCallback, useContext } from 'react';
import { Grid, RadioGroup, Radio, IGridColumn, NumberInput, Form, FormControl, Icon } from 'zent';
import { Context } from '../../context';
import { PhaseOneNeedBoost } from '../../types';
import { toggleSwitch, boosterNumberErrorParser, couponAmountErrorParser, boostSelectValidator } from './utils';
import { IBoostSelectData, BoostFieldType } from './types';
import cx from 'classnames';
import isNil from 'lodash/isNil';

import './styles.scss';

const { ValidateOption } = Form;
const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

const BoostSelectField: FC<{
  name: string;
  defaultValue: IBoostSelectData;
  disabled: boolean;
}> = (props) => {
  const { name, defaultValue, disabled, ...controlProps } = props;

  const { state } = useContext(Context);

  const boostSelectModel = Form.useField<IBoostSelectData>(name, defaultValue, [boostSelectValidator]);
  const { enableNoBoost, boostDetail } = boostSelectModel.value;
  const canAdd = useMemo(() => boostDetail && boostDetail.length < 4, [boostDetail]);
  const isDirty = state.formSubmitted || boostSelectModel.dirty();

  const handleSwitchChange = useCallback(
    (need: PhaseOneNeedBoost) => {
      const sortedDetail = boostDetail.sort((a, b) => a.phaseNo - b.phaseNo);

      boostSelectModel.patchValue({
        enableNoBoost: need,
        boostDetail: toggleSwitch(sortedDetail, need),
      });
      boostSelectModel.validate(VALIDATE_OPTION);
    },
    [boostSelectModel, boostDetail],
  );

  const handleAddPhase = useCallback(() => {
    if (!canAdd || disabled) {
      return;
    }
    const sortedDetail = boostDetail.sort((a, b) => a.phaseNo - b.phaseNo);
    boostSelectModel.patchValue({ // 坑
      enableNoBoost,
      boostDetail: sortedDetail.concat({
        amount: null,
        helpCnt: null,
        phaseNo: boostDetail.length + 1,
      }),
    });
    boostSelectModel.validate(ValidateOption.Default);
  }, [canAdd, disabled, enableNoBoost, boostDetail, boostSelectModel]);

  const deleteSelectedPhase = useCallback(
    (phaseNo) => {
      if (disabled) {
        return;
      }
      const sortedDetail = boostDetail.sort((a, b) => a.phaseNo - b.phaseNo);
      const index = sortedDetail.findIndex(phase => phase.phaseNo === phaseNo);
      if (index > -1) {
        sortedDetail.splice(index, 1);

        boostSelectModel.patchValue({
          enableNoBoost,
          boostDetail: sortedDetail.map((phase, index) => ({
            ...phase,
            phaseNo: index + 1,
          })),
        });
        boostSelectModel.validate(VALIDATE_OPTION);
      }
    },
    [disabled, enableNoBoost, boostDetail, boostSelectModel],
  );

  const handleBoostFieldChange = useCallback((phaseNo: number, type: BoostFieldType) => value => {
    boostSelectModel.patchValue({
      enableNoBoost,
      boostDetail: boostDetail.map(phase => {
        if (phase.phaseNo === phaseNo) {
          return {
            ...phase,
            [type]: value,
          };
        }
        return phase;
      }),
    });
    boostSelectModel.validate(ValidateOption.Default);
  }, [enableNoBoost, boostDetail, boostSelectModel]);

  const columns: IGridColumn[] = useMemo(
    () => [
      {
        title: '阶段',
        name: 'phaseNo',
        width: 50,
      },
      {
        title: '助力人数',
        width: 110,
        bodyRender: ({ helpCnt, phaseNo }) => {
          const sortedDetail = boostDetail.sort((a, b) => a.phaseNo - b.phaseNo);
          return helpCnt !== 0 ? (
            <>
              <NumberInput
                width={80}
                value={helpCnt}
                min={1}
                max={999}
                showStepper
                onChange={handleBoostFieldChange(phaseNo, BoostFieldType.boosterNumber)}
                disabled={disabled}
              />
              {isDirty && boosterNumberErrorParser(phaseNo, helpCnt, enableNoBoost, sortedDetail)}
            </>
          ) : '无需助力';
        },
      },
      {
        title: '学员可领学费(元)',
        width: 140,
        bodyRender: ({ amount, phaseNo }) => {
          const sortedDetail = boostDetail.sort((a, b) => a.phaseNo - b.phaseNo);
          return (
            <>
              <NumberInput
                width={112}
                value={amount}
                min={0}
                // placeholder="1-99"
                decimal={2}
                onChange={handleBoostFieldChange(phaseNo, BoostFieldType.couponAmount)}
                disabled={disabled}
              />
              {isDirty && couponAmountErrorParser(phaseNo, amount, sortedDetail)}
            </>
          );
        },
      },
      {
        title: '操作',
        width: 80,
        textAlign: 'right',
        bodyRender: ({ phaseNo }) => {
          const buttonDisabled = disabled ||
            // 第一阶段不要助力
            (enableNoBoost === PhaseOneNeedBoost.noNeed && phaseNo === 1) ||
            // 是第二阶段、且第一阶段不需要助力，共两个阶段
            (enableNoBoost === PhaseOneNeedBoost.noNeed && boostDetail.length === 2 && phaseNo === 2) ||
            boostDetail.length <= 1;
          return (
            <span
              className={cx('operation', { disabled: buttonDisabled })}
              onClick={() => deleteSelectedPhase(phaseNo)}
            >
              删除
            </span>
          );
        },
      },
    ],
    [disabled, enableNoBoost, boostDetail, deleteSelectedPhase, handleBoostFieldChange, isDirty],
  );

  const renderAddPhase = useMemo(() => {
    const newPhaseBlock = (
      <span className="operation" onClick={handleAddPhase}>
        <Icon type="plus" /> 增加新一级助力
      </span>
    );

    if (disabled) {
      return (
        <div className="fake-grid-tbody">
          <div className="disabled">
            {newPhaseBlock}
          </div>
        </div>
      );
    }
    return (
      <div className="fake-grid-tbody">
        {canAdd ? (
          newPhaseBlock
        ) : (
          <Pop trigger="hover" wrapperClassName="disabled" content="最多设置4级助力">
            {newPhaseBlock}
          </Pop>
        )}
      </div>
    );
  }, [canAdd, disabled, handleAddPhase]);

  return (
    <FormControl {...controlProps} className="boost-setting">
      <div className="phase-one-setting">
        <RadioGroup<PhaseOneNeedBoost>
          className="phase-one-option-field"
          value={enableNoBoost}
          onChange={(e) => {
            !isNil(e.target.value) && handleSwitchChange(e.target.value);
          }}
          disabled={disabled}
        >
          <>
            <Radio className="boost-select__option" value={PhaseOneNeedBoost.noNeed}>
              第一阶段学员无需助力领学费
            </Radio>
            <div className="form-description">
              勾选后，在助力第一阶段，学员无需好友助力可直接领取对应学费，可以提高用户参与活动的积极性。
              <Pop
                trigger="hover"
                position="auto-top-center"
                content={<img width="200px" src={'//b.yzcdn.cn/public_files/236fe245a1c3b6800872b44504d17a90.jpg'} alt='' />}
              >
                <div className="cursor-link">查看示例</div>
              </Pop>
            </div>
            <Radio className="boost-select__option" value={PhaseOneNeedBoost.yes}>
              第一阶段学员需助力领学费
            </Radio>
          </>
        </RadioGroup>
      </div>
      <Grid rowKey="phaseNo" className="boost-setting-table" datasets={boostDetail} columns={columns} />
      {renderAddPhase}
      <span className="boost-setting-desc">
        可领取的学费金额对应的助力人数，指学员领取到对应学费所需要的助力人数。
      </span>
    </FormControl>
  );
};

export default BoostSelectField;
