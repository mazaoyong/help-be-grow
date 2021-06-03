import React, { CSSProperties, FC } from 'react';

import { IStudentProfileItem, convertOptionValues } from '../../../utils/pre-handle-data';
import { DataType } from '@ability-center/student';

interface IOptionGroupProps {
  dataType: IStudentProfileItem['dataType'];
  value?: IStudentProfileItem['attrItem'];
  style?: CSSProperties;
}

const OptionGroup: FC<IOptionGroupProps> = props => {
  const { value = [], style = {}, dataType } = props;
  let content = '-';
  if (dataType === DataType.GENDER) {
    content = '男、女';
  }
  if (value.length) {
    content = convertOptionValues(value).map(val => val.value).join('、');
  }
  return (
    <div className="zent-form__control-group">
      <label className="zent-form__control-label">选项内容：</label>
      <div className="zent-form__controls" style={style}>
        <span>{content}</span>
      </div>
    </div>
  );
};

export default OptionGroup;
