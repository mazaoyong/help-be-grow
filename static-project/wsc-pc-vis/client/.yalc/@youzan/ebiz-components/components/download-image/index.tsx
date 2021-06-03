import React, { FC, useEffect, useState } from 'react';
import { IDownloadImageProps } from './types';
// @ts-ignore
import { toBase64, dataUrlToBlob } from '@youzan/utils/file';
import { Notify } from 'zent';
import './style.scss';

const DownloadImage: FC<IDownloadImageProps> =props => {
  const { url, download = "image" } = props;
  const [blobUrl, setBlobUrl] = useState('');
  useEffect(() => {
    toBase64(url)
      .then((base64Url: string) => {
        const _blobUrl = dataUrlToBlob(base64Url);
        if (_blobUrl) {
          setBlobUrl(URL.createObjectURL(_blobUrl));
        } else {
          Notify.error('生成下载图片失败');
        }
      })
      .catch(() => {
        Notify.error('生成下载图片失败');
      });
  }, [url]);
  return (
    <a href={blobUrl} download={download} className="download-anchor">
      {props.text}
    </a>
  );
}

export default DownloadImage;
export * from './types';
