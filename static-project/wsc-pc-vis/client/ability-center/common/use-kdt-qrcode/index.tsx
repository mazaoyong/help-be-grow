import { useState, useEffect } from 'react';
import buildUrl from '@youzan/utils/url/buildUrl';

import { getQrCode } from './api';
const currentKdtId = window._global.kdtId;

interface IProps {
  kdtId?: number;
  width?: number;
  height?: number;
  deleteWhite?: boolean;
}

const useKdtQrcode = ({ kdtId = currentKdtId, width = 80, height = 80, deleteWhite = false }: IProps = {}) => {
  const [qrcode, setQrcode] = useState('');
  useEffect(() => {
    getQrCode({
      url: buildUrl(`https://h5.youzan.com/wscshop/showcase/homepage?kdt_id=${kdtId}`, '', kdtId),
      width,
      height,
      deleteWhite
    })
      .then(res => {
        setQrcode(res);
      });
  }, [kdtId, width, height]);
  return [qrcode];
};

export default useKdtQrcode;
