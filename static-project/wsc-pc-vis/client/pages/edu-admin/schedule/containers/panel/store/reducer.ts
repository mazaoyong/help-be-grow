import { IState } from './state';
import { IViewData, IListData } from '../types';
import { hashHistory } from 'react-router';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import { getCurrentQuery, setQuery } from '../../../utils/query';

export type Actions =
  | { type: 'search' }
  | { type: 'loading'; value?: boolean }
  | { type: 'setFilter'; value: Partial<IState> }
  | { type: 'setType'; value: 'view' | 'list' }
  | { type: 'setViewData'; value: { loading: false; data: IViewData } }
  | { type: 'setListData'; value: { loading: false; data: IListData } }
  | { type: 'setIntervalValue'; value: number }
  | { type: 'setActiveId'; value: number }
  | { type: 'setShowCategory'; value: string[] }
  | { type: 'setPageInfo'; value: IState['pageInfo'] }
  | { type: 'setCurrentItem'; value: IState['currentItem']};

export function reducer(state: IState, action: Actions): IState {
  switch (action.type) {
    case 'setType':
      const location = hashHistory.getCurrentLocation();
      hashHistory.replace({
        pathname: location.pathname.replace(/(list|view)$/, action.value), // 兼容班级详情看板
        query: { ...getCurrentQuery(), pageNumber: 1 },
      });
      return Object.assign({}, state, { type: action.value });
    case 'setFilter':
      const newState = Object.assign({}, state, action.value);
      setQuery(newState);
      return newState;
    case 'search':
      return state;
    case 'loading':
      return Object.assign({}, state, { loading: !!action.value });
    case 'setViewData':
      return Object.assign({}, state, { loading: action.value.loading, data: action.value.data });
    case 'setListData':
      return Object.assign({}, state, {
        loading: action.value.loading,
        tableData: action.value.data,
      });
    case 'setIntervalValue':
      YZLocalStorage.setItem('eduScheduleInterval', action.value);
      return Object.assign({}, state, { interval: action.value });
    case 'setActiveId':
      let result = { activeId: action.value, data: {}, pageInfo: { pageSize: 10, current: 1, total: 0 }, loading: true, };
      if (action.value) {
        result['scheduleType'] = 'week';
      }
      return Object.assign({}, state, result);
    case 'setPageInfo':
      return Object.assign({}, state, { pageInfo: action.value });
    case 'setShowCategory':
      return Object.assign({}, state, { showCategory: action.value });
    case 'setCurrentItem':
      return Object.assign({}, state, { currentItem: action.value });
    default:
      return state;
  }
}
