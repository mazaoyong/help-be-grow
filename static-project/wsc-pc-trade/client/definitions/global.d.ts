import { IWscPcBaseGlobal } from '@youzan/wsc-pc-base/definitions/index';
import { ITeamAdminItem } from './../../definitions/common/user-role';

export interface ITrackLog {
  et: string; // 事件类型
  ei: string; // 事件标识
  en: string; // 事件名称
  pt: string; // 页面类型
  params: object; // 事件参数
}

declare global {
  /**
   * webpack 打包变量
   */
  const __DEBUG__: boolean;

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface WscGlobal extends IWscPcBaseGlobal {
    [key: string]: any;
    teamAdmin: ITeamAdminItem[];
  }

  interface IZanSpa {
    navigateTo(urlOrEvent: string | MouseEvent): void;
    registerPage(pageInfo: any): void;
    unregisterPage(name: string): void;
  }

  const _global: WscGlobal;
  const ZanSpa: IZanSpa;

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    // @ts-ignore @youzan/retail-shop-utils 定义冲突，后续替换
    _global: WscGlobal;

    ZanSpa: IZanSpa;

    Logger?: {
      log: (params: ITrackLog) => void | any;
    };
  }
}
