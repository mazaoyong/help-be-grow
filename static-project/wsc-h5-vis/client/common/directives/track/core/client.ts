import { get, clone, merge } from 'lodash';

import { Timings, IConfig, ITrackSetting } from '../types';

import { IGlobalTrackerSetting, ZanTrackerInstance } from '../utils/zan-tracker-types';
import invokeLog, { IInvokePayload } from '../utils/invoke-log';
import { clientAdaptors } from '../utils/client-adaptors';

const DEFAULT_STRING = 'fakePt';

type RequiredClientSettingType = ITrackSetting & {
  logClientSetting: Required<IGlobalTrackerSetting>;
};
export default class Client {
  public $timestamp?(): number;

  // 默认初始化成为zan-web-tracker的形式，如果特定客户端无法完成初始化
  // 参照logClientSetting的方式进行转换
  public $setting: RequiredClientSettingType;
  public $logClient: ZanTrackerInstance;
  public $store: Record<string, any> = {};
  private _templateConfig: IConfig;

  private _cachedSpm = '';

  private _initTimestamp = () => {
    if (this.$setting) {
      const { attachTimestamp = false } = this.$setting;
      if (attachTimestamp) {
        this.$timestamp = () => new Date().getTime();
      }
    }
  };

  constructor(setting: ITrackSetting) {
    // 需要根据logClientSetting初始化logClient
    const { client, clientSetting } = clientAdaptors.convertLogClient(setting.logClient, setting.logClientSetting);
    this.$logClient = client;
    this.$setting = {
      ...setting,
      logClientSetting: clientSetting,
    };

    // 初始化用户信息，平台信息并且完成enterpage事件的上报
    this._initTimestamp();

    this._templateConfig = {
      name: DEFAULT_STRING,
      eventId: DEFAULT_STRING,
      eventName: DEFAULT_STRING,
      pageType: setting.globalPageType || DEFAULT_STRING,
      timing: Timings.ViewDisplay,
    };
  }

  public invokeTask = (config: IConfig, passiveData?: IInvokePayload) => {
    const _originData = passiveData || this.getStore(config);
    // 添加时间戳属性会统一对入参进行clone操作，所以后续直接在已clone对象上直接修改
    const data0 = this.attachTimestamp(_originData);
    const data1 = this.setOrigin(config, data0);
    const finalData = this.setSpm(data1);
    invokeLog(this.$logClient, config, this._templateConfig, finalData);
  };

  public getStore = (config: IConfig, evt?: any): IInvokePayload => {
    const passiveData: IInvokePayload = { params: {} };
    if (evt) {
      passiveData.event = evt;
    }
    if (config) {
      const { data } = config || {};
      if (data) {
        if (typeof data === 'function') {
          // 浅拷贝传递参数
          try {
            passiveData.params = data(clone(this.$store));
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[error]' + err);
            passiveData.params = 'TERMINATE';
            return passiveData;
          }
        } else {
          passiveData.params = data;
        }
      }
    }
    return passiveData;
  };

  // 重置store
  public resetStore = (newStore?: Record<string, any>) => {
    if (!newStore || Object.keys(newStore).length === 0) {
      this.$store = {};
    } else {
      this.$store = merge(this.$store, newStore);
    }
  };

  // 统一加上时间戳
  public attachTimestamp = (passiveParams: IInvokePayload): IInvokePayload => {
    if (this.$timestamp && passiveParams.params !== 'TERMINATE') {
      const clonedParams = clone(passiveParams);
      (clonedParams.params as Record<string, any>)['log_time'] = this.$timestamp();
      return clonedParams;
    }
    return passiveParams;
  };

  // 设置来源信息
  public setOrigin = (config: IConfig, passiveParams: IInvokePayload): IInvokePayload => {
    try {
      if (config.timing === Timings.EnterPage) {
        if (config.withOrigin && passiveParams.params !== 'TERMINATE') {
          // 匹配url中形如originKey=ORIGIN_KEY::ORIGIN_VALUE的参数
          const originReg = new RegExp(`${config.originKey || 'eduOrigin'}=(\\w+(::|%3A%3A)\\S+&?)`);
          const originValueString = location.href.match(originReg);
          if (originValueString) {
            const decodeOrigin = decodeURIComponent(originValueString[1]);
            const [origin, originValue] = decodeOrigin.split('::');
            passiveParams.params.origin = origin;
            passiveParams.params.origin_value = originValue;
          }
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('匹配来源信息出错!' + err);
    }
    return passiveParams;
  };

  public setSpm = (passiveParams: IInvokePayload): IInvokePayload => {
    try {
      if (get(this.$setting, 'logClientSetting.autoSpm', true)) {
        // 如果开启了自动添加spm，并且_global中spm字段无值
        if (passiveParams.params !== 'TERMINATE' && !passiveParams.params.spm) {
          if (Object.keys(_global.spm).length === 0) {
            const spmMatchRes = get(location, 'href', '')
              .split('?')[0]
              .match(/\/(\S[^/]+\/\S[^/]+)$/);
            if (!this._cachedSpm) {
              if (spmMatchRes) {
                const [, pageType] = spmMatchRes[1].split('/');
                this._cachedSpm = `${pageType}.0`;
                _global.spm = {
                  logType: pageType,
                  logId: '0',
                };
              }
            }
          } else {
            this._cachedSpm = `${_global.spm.logType}.${_global.spm.logId}`;
          }
          if (this._cachedSpm) {
            passiveParams.params.spm = this._cachedSpm;
          }
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('获取spm出错\n' + '[err]' + err);
    }
    return passiveParams;
  };
}
