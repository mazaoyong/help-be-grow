import { DateRangePicker } from '@zent/compat';
import React, { useState, useContext } from 'react';
import { Grid, Button } from 'zent';
import HelpIcon from 'shared/components/help-icon';
import format from 'date-fns/format';
import startOfYesterDay from 'date-fns/start_of_yesterday';
import subDays from 'date-fns/sub_days';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import addDays from 'date-fns/add_days';
import get from 'lodash/get';
import { isEduChainStore } from '@youzan/utils-shop';
import { formatUnitMap } from '../../../components/charts/common';
import SourceFilter from '../../../components/source-filter';
import { useInitConversionData } from '../../hooks/conversion';
import { campus } from '../../../reducers/campus';
import { CONVERSION, CLUE, COLUMNS } from './config';
import { yesterdayReady } from '../../../common/config';

import './index.scss';

const yesterday = startOfYesterDay();
const end = yesterdayReady ? yesterday : subDays(yesterday, 1);

function Conversion() {
  const { context } = useContext(campus);
  const [startDay, setStartDay] = useState(format(subDays(end, 30), 'YYYY-MM-DD'));
  const [endDay, setEndDay] = useState(format(end, 'YYYY-MM-DD'));
  const [srcId, setSrcId] = useState(null);
  const [srcGroupId, setSrcGroupId] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const {
    data,
    list,
    loading,
  } = useInitConversionData(startDay, endDay, srcId, srcGroupId, trigger, context.subKdtId);

  const onChangeRange = (timeArr) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
  };

  const onChangeSrcId = data => {
    const [srcGroupId, srcId] = get(data, 'value', []);
    setSrcId(srcId);
    setSrcGroupId(srcGroupId);
  };

  const onFilter = () => {
    setTrigger(!trigger);
  };

  const getDisabledDate = (startDay, endDay) => {
    const min = 0;
    const max = yesterday;
    const maxSpan = 90 - 1;

    // 都没有选择
    if (!startDay && !endDay) {
      return date => isBefore(date, min) || isAfter(date, max);
    }

    // 选择了开始时间
    if (startDay && !endDay) {
      return (date, type) => {
        if (type === 'end') {
          return isBefore(date, startDay) || isAfter(date, addDays(startDay, maxSpan));
        } else {
          return isBefore(date, min) || isAfter(date, max);
        }
      };
    }

    // 选择了结束时间
    if (!startDay && endDay) {
      return (date, type) => {
        if (type === 'start') {
          return isBefore(date, subDays(endDay, maxSpan)) || isAfter(date, endDay);
        } else {
          return isBefore(date, min) || isAfter(date, max);
        }
      };
    }

    return (date, type) => {
      if (type === 'start') {
        return isBefore(date, min) || isBefore(date, subDays(endDay, maxSpan));
      } else {
        return isAfter(date, max) || isAfter(date, addDays(startDay, maxSpan));
      }
    };
  };

  const clsPrefix = 'distribution-container';
  const filterPrefix = 'vis-filter';

  return (
    <div className={clsPrefix}>
      <div className={`${clsPrefix}__header`}>
        <h2>线索转化分析</h2>
      </div>
      <div className={`${filterPrefix}_region clearfix`}>
        <div className={`${filterPrefix}_item`}>
          <label className={`${filterPrefix}_label`}>线索创建时间：</label>
          <div className={`${filterPrefix}_controls`}>
            <DateRangePicker
              format="YYYY-MM-DD"
              valueType="string"
              value={[startDay, endDay]}
              onChange={onChangeRange}
              disabledDate={getDisabledDate(startDay, endDay)}
            />
          </div>
        </div>
        {
          (!isEduChainStore || context.subKdtId !== 0) &&
          <div className={`${filterPrefix}_item`}>
            <label className={`${filterPrefix}_label`}>来源：</label>
            <div className={`${filterPrefix}_controls`}>
              <SourceFilter
                value={[srcGroupId, srcId]}
                onChange={onChangeSrcId}
              />
            </div>
          </div>
        }
        <div className={`${filterPrefix}_bottom`}>
          <Button
            type="primary"
            onClick={onFilter}
            loading={loading}
          >
            筛选
          </Button>
        </div>
      </div>
      <div className={`${clsPrefix}__content`}>
        <div className={`${clsPrefix}__content-chart`}>
          <img className="conversion-img" src="https://img.yzcdn.cn/public_files/6063ad07ed0bbce5d442048a63c2ed7b.png" width="269" height="388" />
          {
            CONVERSION.map(({ title, key, top, left }, index) => {
              return (
                <div key={index} className="conversion-item" style={{ top, left }}>
                  {title}
                  <p>{data[key]}</p>
                </div>
              );
            })
          }
          {
            CLUE.map(({ title, key, color }, index) => {
              return (
                <div key={index} className="clue-item" style={{ backgroundColor: color }}>
                  <div className="clue-item__title">{title}</div>
                  <div className="clue-item__stat">{formatUnitMap.numberThousandSymbol(data[key])}</div>
                </div>
              );
            })
          }
        </div>
        <div className={`${clsPrefix}__content-table`}>
          <h4>
            转化周期分析
            <HelpIcon help="转化周期：线索首次成交与线索创建的时间差" position="top-center" type="help-circle" />
          </h4>
          <Grid
            columns={COLUMNS}
            datasets={list}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Conversion;
