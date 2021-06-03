import React from 'react';
import { useStore } from '../store';
import { fullfillImage } from '@youzan/utils';
import { IDrawStyle, textImageUrl } from '../container/create-page/get-qrcode-position';

const defaultImage: string =
  'https://img.yzcdn.cn/upload_files/2020/11/11/FpSCuGzvnAuIwJjLvYNsFP9R80mz.png';
const defaultFixedImage: string =
  'https://img.yzcdn.cn/upload_files/2020/11/11/FmaHdVkjpJGMj_L411HfMmETYhwG.png';
const clsNamePrefix = 'image-preview';

interface IImagePreviewProps {
  styles: IDrawStyle;
}

function ImagePreview(props: IImagePreviewProps) {
  const { styles } = props;
  const [data] = useStore();
  const { formData } = data;
  const { modelType, modelImageUrl = '', qrcode = '' } = formData;
  const qrcodeStyle = {
    bottom: `${styles.qrcodePreviewOffset.bottom}px`,
    right: `${styles.qrcodePreviewOffset.right}px`,
  };
  const textStyle = {
    bottom: `${styles.textPreviewOffset.bottom}px`,
    right: `${styles.textPreviewOffset.right}px`,
  };
  return (
    <div className={clsNamePrefix}>
      <div className={`${clsNamePrefix}-content`}>
        <img
          className={`${clsNamePrefix}-content-img`}
          src={fullfillImage(
            modelImageUrl || (modelType === 0 ? defaultImage : defaultFixedImage),
            '!304x480.jpg',
          )}
        />
        {modelType === 0 && qrcode && (
          <img src={qrcode} className={`${clsNamePrefix}-content-qrcode`} style={qrcodeStyle} />
        )}
        {modelType === 0 && qrcode && (
          <img src={textImageUrl} className={`${clsNamePrefix}-content-text`} style={textStyle} />
        )}
      </div>
      <div className={`${clsNamePrefix}-label`}>海报效果预览</div>
    </div>
  );
}

export default ImagePreview;
