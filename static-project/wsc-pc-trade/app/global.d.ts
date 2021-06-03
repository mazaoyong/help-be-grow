import {
  IWscPcBaseContext,
  IWscPcBaseDefine,
  IWscPcBaseGlobal,
  IWscPcBaseState,
} from '@youzan/wsc-pc-base/definitions';
import { ITeamAdminItem } from 'definitions/common/user-role';

declare global {
  interface IWscPcTradeEnv {
    /**
     * 订单详情页
     */
    storeId?: number;
    isShowMultiStore?: boolean;
    teamAdmin?: ITeamAdminItem[];
    versionStatus: any;
    thirdAppRecommend: any;
    isSupplier: boolean;
    /**
     * 批量发货页面
     */
    operator?: string;
    optimizedExpress: any;
    express: any;
    mealOrderManageAbility: boolean;
    balance?: number;
    /**
     * 订单页
     */
    abcEPay?: boolean; // 白名单控制，农行支付商家
    /**
     * 验证工具
     */
    allowQueryTicketsByPhone: boolean;
  }

  interface IWscPcTradeContext extends IWscPcBaseContext {
    /**
     * 获取经过复杂 query 处理的结果数据
     */
    getComplexQuery<QD = any, K extends keyof QD = any>(
      key?: K,
      extraKeyMap?: Record<string, string | Function>,
    ): QD[K];

    /**
     * 兼容的根店铺 kdtId
     */
    readonly rootKdtId: number;
  }

  interface IWscPcTradeGlobal extends IWscPcBaseGlobal, IWscPcTradeEnv {}

  interface IWscPcTradeState extends IWscPcBaseState, IWscPcTradeEnv {}

  interface IWscPcTradeDefine extends IWscPcBaseDefine {
    ctx: IWscPcTradeContext;
    global: IWscPcTradeGlobal;
    state: IWscPcTradeState;
  }

  type Context = IWscPcTradeContext;
}
