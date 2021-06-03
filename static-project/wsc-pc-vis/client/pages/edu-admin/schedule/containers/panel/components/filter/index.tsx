import { Pop } from '@zent/compat';
// 排课面板筛选条件
import React, { FC, useContext, useCallback } from 'react';
import { Checkbox, Button } from 'zent';
import { context } from '../../store';
import SelectDay from '../select-day';
import SelectWeek from '../select-week';
import SelectMonth from '../select-month';
import SelectCustom from '../select-custom';
import FilterExpand from './new-expand';
import { getWeekOfYear } from '../../../../utils/date';
// import ViewActions from './ViewActions';
import { getScheduleData } from '../../format';
import { format } from 'date-fns';
import './style.scss';

type schedultType = 'day' | 'week' | 'month';

interface ITypeButtonProps {
  type: schedultType;
  text: string;
}

interface IInterfaceProps {
  type: number;
  text: string;
}

const TypeButton: FC<ITypeButtonProps> = ({ type, text }) => {
  const { store, dispatch } = useContext(context);

  return (
    <Button
      className="tab-button__type"
      type={type === store.scheduleType ? 'primary' : 'default'}
      onClick={() => getScheduleData({ scheduleType: type, pageNumber: 1 }, store, dispatch)}
    >
      {text}
    </Button>
  );
};

const IntervalButton: FC<IInterfaceProps> = ({ type, text }) => {
  const { store, dispatch } = useContext(context);
  return (
    <Button
      className="tab-button__interval"
      onClick={() => {
        dispatch({
          type: 'setIntervalValue',
          value: type,
        });
      }}
      type={type === store.interval ? 'primary' : 'default'}
    >
      {text}
    </Button>
  );
};

export interface IFilterProps {
  project?: string;
}

const Filter: FC<IFilterProps> = ({ project }) => {
  const { store, dispatch } = useContext(context);

  // 修改 startTime 触发事件
  const dispatchStartTime = (startTime: Date, endTime?: Date) => {
    const query: {
      startTime: Date,
      pageNumber: number,
      endTime?: Date,
    } = {
      startTime,
      pageNumber: 1,
    };
    if (endTime) {
      query.endTime = endTime;
    }
    getScheduleData(query, store, dispatch, store.activeId);
  };

  const select = showSwitch => ({
    day: (
      <SelectDay
        date={store.startTime}
        onChange={date => dispatchStartTime(date)}
        showSwitch={showSwitch}
      />
    ),
    week: (
      <SelectWeek
        date={store.startTime}
        project={project}
        onChange={date => dispatchStartTime(date)}
        showSwitch={showSwitch}
      />
    ),
    month: (
      <SelectMonth
        date={store.startTime}
        onChange={date => dispatchStartTime(date)}
        showSwitch={showSwitch}
      />
    ),
    custom: (
      <SelectCustom
        date={[store.startTime, store.endTime]}
        onChange={([startTime, endTime]) => dispatchStartTime(startTime, endTime)}
      />
    ),
  });

  // 筛选按钮触发事件
  const onExpandSeatch = (data: any) => {
    getScheduleData({ ...data, pageNumber: 1 }, store, dispatch, store.activeId);
  };

  // 看板展示类型筛选
  const onShowCategoryChange = useCallback((value: string[]) => {
    dispatch({ type: 'setShowCategory', value });
  }, [dispatch]);

  return (
    <div className="panel__filter">
      <div className={`panel__filter__expand-wrap${(store.type === 'view' && store.showMoreFilter) || store.type === 'list' ? '_active' : ''}`}>
        <FilterExpand
          selectComponent={select(false)}
          store={store}
          dispatch={dispatch}
          onSearch={data => onExpandSeatch(data)}
          project={project}
        />
      </div>
      {store.type === 'view' && project === 'educlass' && <div className="panel__filter__group">
        <div className="panel__filter__group__tabs">
          <div className="panel__filter__tabs__btngroup">
            <Button.Group>
              <TypeButton type="day" text="日" />
              <TypeButton type="week" text="周" />
              <TypeButton type="month" text="月" />
            </Button.Group>
            {
              store.scheduleType !== 'month' && (
                <Pop
                  trigger="hover"
                  position="top-center"
                  content={<p>看板时间间隔</p>}
                >
                  <span>
                    <Button.Group>
                      <IntervalButton type={15} text="15分" />
                      <IntervalButton type={30} text="30分" />
                      <IntervalButton type={60} text="1小时" />
                    </Button.Group>
                  </span>
                </Pop>
              )
            }
          </div>
          <div>
            <Checkbox.Group value={store.showCategory} onChange={onShowCategoryChange}>
              <Checkbox className='panel_category_enable' value="enable">待上课</Checkbox>
              <Checkbox className='panel_category_conflict' value="conflict">冲突</Checkbox>
              <Checkbox className='panel_category_deprecated' value="deprecated">已上课</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
        <div className="panel__toolbar__actions">
          {store.scheduleType === 'week' && (
            <span className="week">
              {format(store.startTime, 'YYYY')}年第{getWeekOfYear(store.startTime)}周
            </span>
          )}
          <div className="panel__filter__date">{select(true)[store.scheduleType]}</div>
        </div>
      </div>}
      {store.type === 'view' && project !== 'educlass' && <div className="panel__filter__bar">
        <div className="panel__filter__date">{select(true)[store.scheduleType]}</div>
        <div>
          <Checkbox.Group value={store.showCategory} onChange={onShowCategoryChange}>
            <Checkbox className='panel_category_enable' value="enable">待上课</Checkbox>
            <Checkbox className='panel_category_conflict' value="conflict">冲突</Checkbox>
            <Checkbox className='panel_category_deprecated' value="deprecated">已上课</Checkbox>
          </Checkbox.Group>
        </div>
      </div>}
    </div>
  );
};

export default Filter;
