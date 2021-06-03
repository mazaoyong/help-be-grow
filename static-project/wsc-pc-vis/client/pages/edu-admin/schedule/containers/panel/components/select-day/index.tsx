import { DatePicker } from '@zent/compat';
import React, { FC } from 'react';
import { Icon } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';
import { addDays, subDays } from 'date-fns';
import './style.scss';
import classnames from 'classnames';

export interface ISelectDayProps {
  date: Date;
  onChange: (date: Date) => void;
  showSwitch?: boolean;
}

const SelectDay: FC<ISelectDayProps> = ({ date, onChange, showSwitch = true }) => {
  return (
    <div className="schedule-select__day">
      {showSwitch && (
        <Icon
          type="right"
          className="schedule-select__day__left"
          onClick={() => onChange(subDays(date, 1))}
        />
      )}
      <DatePicker
        format="YYYY年MM月DD日"
        valueType="date"
        canClear={false}
        value={date}
        onChange={date => onChange(new Date(date))}
      />
      {showSwitch && (
        <Icon
          type="right"
          className="schedule-select__day__right"
          onClick={() => onChange(addDays(date, 1))}
        />
      )}
      <SamLink
        className={classnames({
          today: true,
          'has-margin': !showSwitch,
        })}
        onClick={() => onChange(new Date())}
      >
        今天
      </SamLink>
      <SamLink className="tomorrow" onClick={() => onChange(addDays(new Date(), 1))}>
        明天
      </SamLink>
    </div>
  );
};

export default SelectDay;
