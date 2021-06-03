import { createState, StateData, StateUpdators } from 'zan-shuai';
import {
  ISecuredInfoResult,
  AuditStatus
} from '../definitions';

export interface MainState {
  status: AuditStatus;
  calcOrders: ISecuredInfoResult['calcOrders'];
  records: ISecuredInfoResult['records']; // 操作历史记录
  recordsLoading: boolean; // 是否显示操作历史加载状态
}

interface MainActions {
  updateStatusData: ISecuredInfoResult;
  updateInfoData: ISecuredInfoResult;
  updateHistory: ISecuredInfoResult;
  toggleShowHistoryLoading: boolean;
}
export type ActionTypes = StateUpdators<MainActions>;

const defaultBaseState: MainState = {
  // INIT(0,'未开通'), PASS(1,'已开通'), WAIT(2,'待审核')
  status: 0,
  calcOrders: {
    // 快速回款订单数
    orderCount: 0,
    // 快速回款金额
    totalAmount: 0,
  },
  records: {
    content: [],
    pageable: {
      pageSize: 10,
      pageNumber: 1,
    },
    total: 0
  },
  recordsLoading: false,
};

const mainState: StateData<MainState, MainActions> = {
  initial: defaultBaseState,

  updateStatusData(state, status) {
    return {
      ...state,
      status
    };
  },

  updateInfoData(state, data) {
    return {
      ...state,
      calcOrders: data,
    };
  },

  updateHistory(state, data) {
    return {
      ...state,
      records: data,
    };
  },

  toggleShowHistoryLoading(state, show) {
    return {
      ...state,
      recordsLoading: show,
    };
  },
};

export default createState('payback', mainState);
