import React from 'react';
import { Radio, RadioGroup } from 'zent';

import { IMPORT_TYPE, IMPORT_INFO_TYPE } from '../../constants';
import styles from './styles.m.scss';

interface IChooseImportInfoProps {
  value: IMPORT_TYPE;
  onChange: (value: number) => void;
}

const radioFields = [
  {
    value: IMPORT_INFO_TYPE.CourseInfo,
    label: '导入报课课程信息',
    subTitle: '可导入学员报读课程的信息，包括课时/金额等。',
  },
  {
    value: IMPORT_INFO_TYPE.StudentInfo,
    label: '导入学员基本信息',
    subTitle:
      '根据自定义的资料项，导入学员基本信息，包括学员姓名、联系人手机号、年龄、就读学校等。',
  },
];

export default function ChooseImportInfo(props: IChooseImportInfoProps) {
  const { value, onChange } = props;

  function handleChange(e) {
    onChange && onChange(e.target.value);
  }

  return (
    <div>
      <RadioGroup onChange={handleChange} value={value}>
        {radioFields.map(({ value, label, subTitle }) => {
          return (
            <div className={styles.radioItem} key={value}>
              <Radio value={value}>{label}</Radio>
              <div className={styles.subTitle}>{subTitle}</div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
