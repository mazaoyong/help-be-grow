import { React, useCallback, createComponent } from '@youzan/tany-react';
import { Radio } from 'zent';
import ClassSelector from '../class-selector';

import { joinLimit } from 'domain/workbook-domain/types';
import { ISelectedClass } from '../../types';
import './styles.scss';

const joinTypeOptionMap = {
  [joinLimit.freeToJoin]: '自由领取',
  [joinLimit.boundClass]: '加入班级后自动发放',
};

const joinTypeDescMap = {
  [joinLimit.freeToJoin]: '用户可以自主领取作业本。',
  [joinLimit.boundClass]:
    '用户加入班级后，自动领取作业本；用户离开班级后，仅能查看已提交的作业。',
};
const JoinTypeSelect = (props) => {
  const { value, onChange, disabled } = props;

  const onTypeChange = useCallback(
    (e) => {
      onChange({
        value: {
          type: e.target.value,
        },
      });
    },
    [onChange],
  );

  const onSelectedClassChange = useCallback(
    (classData: ISelectedClass) => {
      if (value?.type === joinLimit.boundClass) {
        onChange({
          value: {
            type: value.type,
            eduClass: classData,
          },
        });
      }
    },
    [value, onChange],
  );

  const { type, eduClass } = value;
  // const noClass = !eduClass || !eduClass?.classId;

  return (
    <Radio.Group className="join-type" onChange={onTypeChange} value={type} disabled={disabled}>
      <Radio value={joinLimit.freeToJoin}>{joinTypeOptionMap[joinLimit.freeToJoin]}</Radio>
      <p className="desc">{joinTypeDescMap[joinLimit.freeToJoin]}</p>
      <Radio value={joinLimit.boundClass}>{joinTypeOptionMap[joinLimit.boundClass]}</Radio>
      {type === joinLimit.boundClass && (
        <ClassSelector value={eduClass} onChange={onSelectedClassChange} disabled={disabled} />
      )}
      {/* {type === joinLimit.boundClass && noClass
        ? <FormError className="field-dialog-item__error">请选择关联班级</FormError>
        : null
      } */}
      <p className="desc">{joinTypeDescMap[joinLimit.boundClass]}</p>
    </Radio.Group>
  );
};

const JoinTypeSelectComponent = createComponent(JoinTypeSelect);

export default JoinTypeSelectComponent;
