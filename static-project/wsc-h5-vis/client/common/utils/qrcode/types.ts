import { ENV } from '@/constants/env';

/**
 * ====== common =====
 */

export interface ICombineUrlConfig {
  /** 页面路径 */
  page?: string;
  /** 参数 */
  query?: Record<string, any>;
  /** url */
  url?: string;
}

/**
 * ====== utils =====
 */

/** 可以分别控制二维码尺寸 */
export type TSizeMap = Partial<Record<ENV, number>>;

export type TUrlMap<T> = Partial<Record<ENV, T>>;

/** 基本参数 */
export interface IBaseOptions {
  /** 显示指定获取码的类型，默认会自动判断 */
  env?: ENV;
  /** 是否转成短链接，默认为否，仅对 h5 二维码有效 */
  shortenUrl?: boolean;
  /** 发起请求的时候是否显示 Loading，默认为是 */
  ajaxLoading?: boolean;
  /** 二维码尺寸 */
  size?: number;
  /** 二维码纠错等级，仅对 h5 二维码有效果， 默认为 1 */
  errorCorrectionLevel?: number;
  /** 背景透明，仅在小程序码里有效果，默认为 false */
  transparentBackground?: boolean;
  /** 是否去除白边 */
  removeBorder?: boolean;
  /** 重试次数 */
  retryCount?: number;
}

/**
 * ====== services =====
 */

/** 接口请求的统一参数 */
interface IFetchQrCodeOptions {
  /** 生成二维码的尺寸 */
  size?: number;
  /** 请求时是否显示 Loading，默认为否 */
  ajaxLoading?:boolean;
}

/** h5 二维码接受的参数 */
export interface IFetchH5QrCodeOptions extends IFetchQrCodeOptions {
  /** 要缩短的 URL */
  url?: string;
  /** 缩短网址 */
  shortenUrl?: boolean;
  /** 纠错等级 1-4 */
  errorCorrectionLevel?: number;
  /** 去除白边 */
  removeBorder?: boolean;
}

/** 小程序码接受的参数 */
export interface IFetchWeappQrCodeOptions extends IFetchQrCodeOptions, ICombineUrlConfig{
  /** 背景透明 */
  transparentBackground: boolean;
}

/** 小程序码接受的参数 */
export interface IFetchSwanAppQrCodeOptions extends IFetchQrCodeOptions, ICombineUrlConfig{}
