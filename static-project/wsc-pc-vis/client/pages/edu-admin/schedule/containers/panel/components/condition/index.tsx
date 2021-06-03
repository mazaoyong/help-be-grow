import React, { FC, useEffect, useContext, useCallback } from 'react';
import Toolbar from '../toolbar';
import Filter from '../filter';
import { Tabs, ITab } from 'zent';

import { context, StateType } from '../../store';
import { getScheduleData } from '../../format';
import SettingIcon from './settings';
// import ViewActions from './ViewActions';
import './style.scss';

import { getCurrentQuery } from '../../../../utils/query';

export interface IConditionProps {
  project?: string;
}

const scheduleTabs: (loading: boolean) => ITab<number>[] = (loading) => [
  {
    title: '时间课表视图',
    key: 0,
    disabled: loading,
  },
  {
    title: '老师课表视图',
    key: 1,
    disabled: loading,
  },
  {
    title: '教室课表视图',
    key: 3,
    disabled: loading,
  },
  {
    title: '班级课表视图',
    key: 2,
    disabled: loading,
  },
];

const typeTabs: (project: string) => ITab<'view' | 'list'>[] = (project) => [
  {
    title: project === 'educlass' ? '看板视图' : '课表',
    key: 'view',
  },
  {
    title: project === 'educlass' ? '列表视图' : '日程列表',
    key: 'list',
  },
];

const Condition: FC<IConditionProps> = ({ project }) => {
  const { store, dispatch } = useContext(context);
  // const [activeId, setActiveId] = useState<number>(store.activeId);

  const onTabChange: (id: number) => void = useCallback((id) => {
    dispatch({ type: 'setActiveId', value: id });
  }, []);

  const onTypeChange: (type: 'view' | 'list') => void = useCallback((type) => {
    dispatch({ type: 'setType', value: type });
  }, []);

  // 初始化路由数据并发送页面请求
  useEffect(() => {
    const query = getCurrentQuery();
    const state: Partial<StateType> = {
      tableData: {
        content: [],
        total: 0,
        pageable: {
          pageNumber: query.pageNumber || 1,
          pageSize: query.pageSize || 10,
          sort: { orders: [] },
        },
      },
    };

    dispatch({ type: 'setFilter', value: state });
    // 发送请求
    getScheduleData(state, store, dispatch, store.activeId);
  }, [store.type, store.activeId, store.scheduleType, store.startTime]);

  return (
    <div className="panel__condition">
      { <div className="panel__type__tabs"><Tabs
        type={project === 'educlass' ? 'card' : 'normal' }
        activeId={store.type}
        onChange={onTypeChange}
        tabs={typeTabs(project || '')}
      />
      <SettingIcon project={project || ''} />
      </div>
      }
      {store.type === 'view' && project !== 'educlass' && <Tabs
        className='panel__view__tabs'
        type='card'
        activeId={store.activeId}
        onChange={onTabChange}
        tabs={scheduleTabs(store.loading)}
      >
      </Tabs> }
      <Toolbar project={project} />
      <Filter project={project} />
    </div>
  );
};

export default Condition;
