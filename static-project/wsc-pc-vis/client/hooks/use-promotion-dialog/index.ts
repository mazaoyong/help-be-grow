import { useEffect, useCallback, useMemo } from 'react';
import { closeDialog } from 'zent';
import { PromotionDialog } from '@youzan/react-components';
import { url } from '@youzan/utils';
import cx from 'classnames';
import type { ICreatePosterArgs } from '@youzan/react-components/typings/components/promotion-dialog/types';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import { compareVersion } from 'shared/fns/compare-version';
import { getBdappCode } from 'common/api/request'; // showBdappCode
import { getWapQrCode } from './api';

const UNIQUE_PRIMOTION_DIALOG_ID = 'PROMOTION_DIALOG_UNIQUE_ID'; // 不可修改

interface IPromotionDialogProps {
  createPoster: (args: ICreatePosterArgs) => any;
  getActivity?: () => Promise<any>;
  targetUrl: string;
  className?: string;
  minWeappVersion?: string;
}

const weappVersion = _global?.weappVersion?.releasedVersion;

const usePromotionDialog = (props: IPromotionDialogProps) => {
  const { createPoster, getActivity, targetUrl, minWeappVersion, ...dialogProps } = props;

  /** 是否绑定小程序且大于所需最低小程序版本要求 */
  const weappEnabled = minWeappVersion
    ? !!(weappVersion && compareVersion(weappVersion, minWeappVersion) >= 0)
    : !!weappVersion;

  const bdappEnabled = !!_global?.bdapp?.mpId;

  const h5Url = useMemo(() => url.buildUrl(targetUrl, 'h5', _global.kdtId), [targetUrl]);
  const weappUrl = useMemo(() => url.args.add('/packages/edu/webview/index', {
    targetUrl: url.buildUrl(targetUrl, 'h5', _global.kdtId),
  }), [targetUrl]);

  useEffect(() => {
    // if (showBdapp === undefined) {
    //   // 不来自于列表页（来自于新建、编辑成功页）
    //   showBdappCode().then((res) => {
    //     res && res.mpId && setBdapp(true);
    //   });
    // }

    return () => closeDialog(UNIQUE_PRIMOTION_DIALOG_ID);
  }, []);

  const close = useCallback(() => {
    closeDialog(UNIQUE_PRIMOTION_DIALOG_ID);
  }, []);

  const open = useCallback(() => PromotionDialog.openPromotionDialog({
    supportH5: true,
    supportWeapp: weappEnabled,
    supportBaiduApp: bdappEnabled,
    weappConfig: {
      hasBoundApp: weappEnabled,
      hasOrderedApp: weappEnabled,
    },
    mode: 'poster',
    h5Url,
    weappUrl,
    baiduAppUrl: weappUrl,
    getQrCode: () => getWapQrCode({ url: h5Url, isShortenUrl: true }),
    // @ts-ignore
    getWeappCode: () => fetchWeappQrcode(weappUrl).then((data: string = '') => `data:image/png;base64,${data}`),
    getBaiduAppCode: () =>
      getBdappCode({ path: weappUrl, businessType: 1 }).then(
        (data: string = '') => `data:image/png;base64,${data}`,
      ),
    getActivity,
    className: cx('promotion-dialog', [dialogProps.className]),
    createPoster,
  }), [createPoster, dialogProps.className, getActivity, h5Url, weappEnabled, weappUrl]);

  return { open, close };
};

export default usePromotionDialog;
