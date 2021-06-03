import React, { useEffect, useState } from 'react';
import { toBase64, dataUrlToBlob } from '../utils';
import { Notify } from 'zent';
interface IProps {
  url: string;
  text: string;
  onClick?: VoidFunction;
}
export default function DownloadImage(props: IProps) {
  const { url, onClick } = props;
  const [blobUrl, setBlobUrl] = useState('');

  const handleClick = () => {
    onClick && onClick();
  };

  useEffect(() => {
    toBase64(url)
      .then(base64Url => {
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
    <a href={blobUrl} download="image" onClick={handleClick}>
      {props.text}
    </a>
  );
}
