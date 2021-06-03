// _global 声明文件

declare module '@youzan/wxsdk';
declare module '@youzan/safe-link';
declare module '@youzan/vis-ui*';
declare module '@youzan/utils/browser/session_storage';
declare module '@youzan/vue-theme-plugin';
declare module '@youzan/zan-web-tracker';
declare module '*.scss';
declare module 'vant';

declare var _global: IGlobal;

declare var __DEBUG__: boolean;
interface Window {
  _global: IGlobal;

  __DEBUG__: boolean;

  Raven: any;

  ZanLogger: any;

  yzStackLog: any;
  yzlogInstance: any;

  __imagePreview__?: (index: number) => void;
  __playVideo__?: (index: number) => void;
  __playingVideoCloseFns__?: Array<() => void>;
}

interface IGlobal {
  pluginEnabled?: boolean; // 插件是否可用
  kdtId: number; // 店铺 ID
  userId: number; // 用户 ID
  isYZEdu: boolean; // 是否为教育店铺
  url: IURL; // url
  nodeEnv: NodeEnv; // node 环境
  shopName: string; // 店铺名称
  mobile: string; // 手机号
  category: string; // 经营商品类目
  isSuperStore: boolean; // 是否为零售店铺
  shopInfo: IShopInfo; // 店铺信息
  shopProd: IShopProd; // 店铺生命周期
  mpAccount?: { [key: string]: string }; // 公众号信息
  // eslint-disable-next-line camelcase
  mp_data: { [key: string]: string }; // 公众号信息
  // eslint-disable-next-line camelcase
  mp_account?: { [key: string]: string }; // 公众号信息
  teamStatus?: { [key: string]: string }; //
  pctStatus?: { [key: string]: string }; // 知识付费生命周期
  weappVersion?: IWeappVersion;
  paidContentAbility?: ShopAbilityCode; // 知识付费能力
  visBuyer?: any;
  miniprogram?: {
    isWeapp?: boolean;
    isSwanApp?: boolean;
  };
  spm: {
    logType: string;
    logId: number;
  },
  shopMetaInfo: {
    shopName: string;
  }
  visUserInfo?: any;
}

// 店铺生命周期
interface IShopProd {
  beginTime: number; // 订购时间
  endTime: number; // 结束时间
  kdtId: number; // 店铺 ID
  lifecycleStatus: LifecycleStatus; // 店铺生命状态
  prodCode: string; // 店铺产品
}

type NodeEnv = 'prod' | 'qa' | 'pre';

// 路由
interface IURL {
  account: string;
  base: string; // base
  bbs: string;
  cdnStatic: string;
  domain: string;
  fenxiao: string; // 分销
  fuwu: string;
  h5: string; // h5
  help: string;
  im: string;
  imgqn: string;
  login: string;
  materials: string;
  scrm: string;
  static: string;
  store: string;
  uic: string;
  v4: string; // v4
  wap: string;
  wsc: string; // v3
  www: string; // v2
}

// 生命周期枚举
declare const enum LifecycleStatus {
  try = 'try', // "试用期"
  valid = 'valid', // "有效期"
  protect = 'protect', // "保护期"
  pause = 'pause', // "歇业"
  close = 'close', // "打烊"
  delete = 'delete', // "删除"
}

// 店铺元数据说明 https://doc.qima-inc.com/pages/viewpage.action?pageId=50301813
interface IShopInfo {
  address: string; // 具体地址
  county: string; // 区域
  city: string; // 城市
  province: string;
  businessName: string;
  contactCountryCode: string;
  contactMobile: string;
  contactName: string;
  contactQQ: string;
  countyId: number;
  createdTime: string;
  intro: string;
  kdtId: number;
  lockStatus: number;
  logo: string;
  nodeCode: string;
  parentKdtId?: number;
  rootKdtId: number; // 总部 kdtId
  setAddress: boolean;
  setBusinessName: boolean;
  setChainOnlineShopMode: boolean;
  setCity: boolean;
  setContactCountryCode: boolean;
  setContactMobile: boolean;
  setContactName: boolean;
  setContactQQ: boolean;
  setCounty: boolean;
  setCountyId: boolean;
  setCreatedTime: boolean;
  setIntro: boolean;
  setJoinType: boolean;
  setKdtId: boolean;
  setLockStatus: boolean;
  setLogo: boolean;
  setNodeCode: boolean;
  setOfflineShopOpen: boolean;
  setOnlineShopOpen: boolean;
  setParentKdtId: boolean;
  setProvince: boolean;
  setRootKdtId: boolean;
  setSaasSolution: boolean;
  setShopName: boolean;
  setShopRole: boolean;
  setShopTopic: boolean;
  setShopType: boolean;
  setSubSolution: boolean;
  shopName: string; // 店铺名称
  shopRole: number; // 店铺角色：0 单店版，1 总部 , 2 连锁门店
  shopTopic: number; // 店铺主题：0 微商城，1 教育
  shopType: number;
}

// 小程序版本信息
interface IWeappVersion {
  id: number, // 公众号id：mpId
  kdtId: number, // 店铺id
  shopType: number, // 店铺类型
  state: string, // 小程序发布状态
  auditId: string, // 微信代码审核单id
  auditResult: string, // 微信代码审核失败备注
  commitedVersion: string, // 最近一次推送的代码的版本号
  committedTemplId: string, // 最近一次推送的代码的模版ID
  releasedVersion: string, // 当前线上的代码的版本号
  releasedTemplId: number, // 当前线上的代码的模版ID
  releasedAt: string, // 当前线上的代码的发布时间
  committedVersion: string; // 提交中的版本号
  latestVersion: number, // 最新可升级的稳定版的版本号
  latestTemplId: number, // 最新可升级的稳定版的模版ID
  latestBetaVersion: string, // 最新可升级的体验版的版本号
  latestBetaTemplId: string, // 最新可升级的体验版的模版ID
}

interface IFormWrapperedComp<T = any> extends T {
  handleSubmit(cb: (data: Record<string, any>) => void): (evt: React.FormEvent<HTMLFormElement>) => void;
  zentForm: {
    getFormValues: () => any;
    getFieldError: (name: any) => any;
    setFieldExternalErrors: (errors: any, updateDirty?: boolean) => void;
    resetFieldsValue: (data: any) => void;
    setFieldsValue: (data: any) => void;
    setFormDirty: (isDirty?: boolean) => void;
    setFormPristine: (isPristine?: boolean) => void;
    initialize: (data: any) => void;
    isFieldDirty: (name: any) => any;
    isFieldTouched: (name: any) => any;
    isFieldValidating: (name: any) => any;
    isValid: () => boolean;
    isValidating: () => boolean;
    isSubmitting: () => boolean;
    isFormAsyncValidated: () => boolean;
    validateForm: (forceValidate?: boolean, callback?: () => void, relatedFields?: string[]) => void;
    asyncValidateForm: (resolve: any, reject: any) => void;
    isFormSubmitFail: () => boolean;
    isFormSubmitSuccess: () => boolean;
    updateFormSubmitStatus: (submitSuccess: any) => void;
  }
}

// 店铺能力状态（1 可用，2 不可用，3 未关联）
type ShopAbilityCode = 1 | 2 | 3;
