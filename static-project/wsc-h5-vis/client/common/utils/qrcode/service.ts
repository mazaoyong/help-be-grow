import { ENV } from '@/constants/env';
import { ajax } from '@youzan/vis-ui';
import { IFetchH5QrCodeOptions, IFetchSwanAppQrCodeOptions, IFetchWeappQrCodeOptions } from './types';

export {
  fetchH5QrCode,
  fetchWeappQrCode,
  fetchSwanAppQrCode,
};

/** ==== services  ===== */

const PREFIX = '/wscvis/common/qr';
const ENDPOINT_MAP = {
  [ENV.H5]: `${PREFIX}/h5QrCode.json`,
  [ENV.WEAPP]: `${PREFIX}/weappQrCode.json`,
  [ENV.SWAN_APP]: `${PREFIX}/swanAppQrCode.json`,
};

/**
 * 从接口获取普通二维码
 *
 * @param {Object} params - 参数，请看 ts 定义
 * @return {Promise<string>} 二维码的 base64 编码 URL
 */
function fetchH5QrCode(params: IFetchH5QrCodeOptions): Promise<string> {
  const {
    url = '',
    size = 280,
    shortenUrl = false,
    ajaxLoading = true,
    errorCorrectionLevel = 2,
    removeBorder = false,
  } = params;
  const payload = {
    url,
    size,
    shortenUrl,
    removeBorder,
    errorCorrectionLevel,
  };
  return ajax({
    url: ENDPOINT_MAP[ENV.H5],
    data: payload,
    loading: ajaxLoading,
    method: 'POST',
  });
}

/**
 * 从接口获取微信小程序码
 *
 * @param {Object} params - 参数，请看 ts 定义
 * @return {Promise<string>} 微信小程序码的 base64 编码 URL
 */
function fetchWeappQrCode(params: IFetchWeappQrCodeOptions): Promise<string> {
  const {
    page,
    query,
    size = 280,
    ajaxLoading = true,
    transparentBackground = false,
  } = params;
  const payload = {
    page,
    query,
    size,
    transparentBackground,
  };
  return ajax({
    url: ENDPOINT_MAP[ENV.WEAPP],
    data: payload,
    loading: ajaxLoading,
    method: 'POST',
  });
}

/**
 * 从接口获取百度小程序码
 *
 * @param {Object} params - 参数，请看 ts 定义
 * @return {Promise<string>} 百度小程序码的 base64 编码 URL
 */
function fetchSwanAppQrCode(params: IFetchSwanAppQrCodeOptions): Promise<string> {
  const {
    page,
    query,
    size = 280,
    ajaxLoading = true,
  } = params;
  const payload = {
    page,
    query,
    size,
  };
  return ajax({
    url: ENDPOINT_MAP[ENV.SWAN_APP],
    data: payload,
    loading: ajaxLoading,
    method: 'POST',
  });
}

// const SERVICE_MAP: Record<ENV, (...args: any[]) => Promise<string>> = {
//   [ENV.H5]: fetchH5QrCode,
//   [ENV.WEAPP]: fetchH5QrCode,
//   [ENV.SWAN_APP]: fetchSwanAppQrCode,
// };

// export default SERVICE_MAP;
