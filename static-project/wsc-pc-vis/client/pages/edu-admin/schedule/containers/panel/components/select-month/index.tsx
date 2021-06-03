import { MonthPicker } from '@zent/compat';
import React, { FC } from 'react';
import { Icon } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';
import './style.scss';
import { addMonths, subMonths } from 'date-fns';
import classnames from 'classnames';

export interface ISelectMonthProps {
  date: Date;
  onChange: (date: Date) => void;
  showSwitch?: boolean;
}

const SelectMonth: FC<ISelectMonthProps> = ({ date, onChange, showSwitch = true }) => {
  return (
    <div className="schedule-select__month">
      {showSwitch && (
        <Icon
          type="right"
          className="schedule-select__month__left"
          onClick={() => onChange(subMonths(date, 1))}
        />
      )}
      <MonthPicker
        format="YYYY年MM月"
        valueType="date"
        canClear={false}
        value={date}
        onChange={date => onChange(new Date(date))}
      />
      {showSwitch && (
        <Icon
          type="right"
          className="schedule-select__month__right"
          onClick={() => onChange(addMonths(date, 1))}
        />
      )}
      <SamLink
        className={classnames({
          today: true,
          'has-margin': !showSwitch,
        })}
        onClick={() => onChange(new Date())}
      >
        本月
      </SamLink>
      <SamLink className="next" onClick={() => onChange(addMonths(new Date(), 1))}>
        下月
      </SamLink>
    </div>
  );
};

export default SelectMonth;
