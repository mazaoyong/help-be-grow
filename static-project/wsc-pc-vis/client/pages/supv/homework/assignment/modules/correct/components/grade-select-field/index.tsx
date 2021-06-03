import { React, FC, createComponent } from '@youzan/tany-react';
import cx from 'classnames';
import { CorrectGrade } from '../../types';
import './styles.scss';

interface ICorrectOption {
  text: React.ReactNode;
  value: CorrectGrade;
  selected: boolean;
  onClick: (value: CorrectGrade) => void;
  style?: Record<string, string>;
}

export const Option: FC<ICorrectOption> = ({ text, value, selected, onClick, ...restProps }) => {
  return (
    <div
      {...restProps}
      className={cx(`grade-select__option ${text}`, { selected })}
      onClick={() => onClick(value)}
    >
      {text}
    </div>
  );
};

const options = [
  { text: 'S', value: 'S' },
  { text: 'A', value: 'A' },
  { text: 'B', value: 'B' },
  { text: 'C', value: 'C' },
  { text: 'D', value: 'D' },
] as Pick<ICorrectOption, 'text' | 'value'>[];
const GradeSelect = (props) => {
  const { value, onChange } = props;

  return (
    <div className="grade-select">
      {options.map((item, index) => (
        <Option key={index} {...item} selected={value === item.value} onClick={onChange} />
      ))}
    </div>
  );
};

export default createComponent(GradeSelect);
