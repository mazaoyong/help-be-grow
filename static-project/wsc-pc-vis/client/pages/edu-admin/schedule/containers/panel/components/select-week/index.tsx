import { WeekPicker } from '@zent/compat';
import React, { FC } from 'react';
import { Icon } from 'zent';
import { getWeekOfYear } from '../../../../utils/date';
import { format, addWeeks, subWeeks, addDays, startOfWeek } from 'date-fns';
import { Link as SamLink } from '@youzan/sam-components';
import './style.scss';
import classnames from 'classnames';

export interface ISelectWeekProps {
  date: Date;
  project?: string;
  onChange: (date: Date) => void;
  dateFormat?: string;
  showSwitch?: boolean;
}

const SelectWeek: FC<ISelectWeekProps> = ({
  date,
  project,
  onChange,
  dateFormat = 'YYYY-MM-DD',
  showSwitch = true,
}) => {
  return (
    <div className="schedule-select__week">
      {project !== 'educlass' && (
        <span style={{ marginRight: 10 }}>
          {format(date, 'YYYY')}年第{getWeekOfYear(date)}周
        </span>
      )}

      {showSwitch && (
        <Icon
          type="right"
          className="schedule-select__week__left"
          onClick={() => onChange(subWeeks(date, 1))}
        />
      )}
      <WeekPicker
        valueType="date"
        format={dateFormat}
        canClear={false}
        value={[date, addDays(date, 7)]}
        onChange={week => onChange(startOfWeek(addDays(week[0]!, 1), { weekStartsOn: 1 }))}
      />
      {showSwitch && (
        <Icon
          type="right"
          className="schedule-select__week__right"
          onClick={() => onChange(addWeeks(date, 1))}
        />
      )}
      <SamLink
        className={classnames({
          today: true,
          'has-margin': !showSwitch,
        })}
        onClick={() => onChange(new Date())}
      >
        本周
      </SamLink>
      <SamLink className="nextweek" onClick={() => onChange(addWeeks(new Date(), 1))}>
        下周
      </SamLink>
    </div>
  );
};

export default SelectWeek;
