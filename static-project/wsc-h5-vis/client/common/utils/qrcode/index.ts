import { ENV } from '@/constants/env';
import { getEnv } from '../env';
import { fetchH5QrCode, fetchSwanAppQrCode, fetchWeappQrCode } from './service';
import { IBaseOptions } from './types';
import { getUrlConfigByEnv } from './utils';

function getQrCode(url: string, option: IBaseOptions): Promise<string> {
  const {
    size = 280,
    shortenUrl = false,
    ajaxLoading = true,
    errorCorrectionLevel = 2,
    transparentBackground = false,
    removeBorder = false,
    env = getEnv(),
  } = option || {};
  const urlConfig = getUrlConfigByEnv(env, url);
  const payload = {
    size,
    shortenUrl,
    ajaxLoading,
    errorCorrectionLevel,
    transparentBackground,
    removeBorder,
    ...urlConfig,
  };
  switch (env) {
    case ENV.WEAPP:
      return fetchWeappQrCode(payload);
    case ENV.SWAN_APP:
      return fetchSwanAppQrCode(payload);
    // case ENV.H5:
    default:
      return fetchH5QrCode(payload);
  }
}

export default getQrCode;
