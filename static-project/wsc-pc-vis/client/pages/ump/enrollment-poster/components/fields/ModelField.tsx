import React, { useCallback, useEffect } from 'react';
import { FormField, RadioGroup, Radio, FormError, Notify } from 'zent';
import { Upload } from '@youzan/react-components';
import { clickTracker } from 'components/logger';
import { useStore, useStoreByValidFlag } from '../../store';
import DownloadImage from '../DownloadImage';
import { checkImage } from '../../container/create-page/get-qrcode-position';
import { ENROLLMENT_POSTER_CREATE } from '../../contants';

const downloadModelImage: string =
  'https://img.yzcdn.cn/public_files/f3908055bc713e901cccb474c3ee9e85.png';
interface IImageData {
  id: number;
  url: string;
  width: number;
  height: number;
}

function ModelSelect() {
  const [data, dispatch] = useStore();
  const [isValid, setValid] = useStoreByValidFlag('modelSelect');
  const { formData } = data;
  const modelType = formData ? formData.modelType : 0;
  const modelImageUrl = formData ? formData.modelImageUrl : 0;

  useEffect(() => {
    if (modelImageUrl) {
      setValid(true);
    }
  }, [modelImageUrl, setValid]);

  const onRadioChange = useCallback(
    e => {
      const modelType = e.target.value;

      dispatch({
        formData: Object.assign({}, formData, { modelType, modelImageUrl: '' }),
      });

      clickTracker({
        eventName: '模板设置',
        eventSign: 'template_set',
        pageType: ENROLLMENT_POSTER_CREATE,
        otherParams: {
          templateType: modelType,
        }
      });
    },
    [formData, dispatch],
  );
  const onUploadSuccess = useCallback(
    data => {
      const image: IImageData[] = data.map(item => {
        return {
          id: item.attachmentId || item.attachment_id,
          url: item.attachmentUrl || item.attachment_url,
          width: item.width,
          height: item.height,
        };
      });
      const bgImageWidth = image[0].width;
      const bgImageHeight = image[0].height;
      if (!checkImage(bgImageWidth, bgImageHeight)) {
        Notify.error('图片尺寸太小，不符合要求，请重新选择');
        return;
      }
      dispatch({
        formData: Object.assign({}, formData, {
          modelImageUrl: image[0].url,
          bgImageWidth,
          bgImageHeight,
        }),
      });
    },
    [formData, dispatch],
  );
  const handleItemDelete = () => {
    dispatch({
      formData: Object.assign({}, formData, {
        modelImageUrl: '',
        bgImageWidth: 0,
        bgImageHeight: 0,
      }),
    });
  };
  const accept = '';
  return (
    <div className="model-select">
      <RadioGroup onChange={onRadioChange} value={modelType}>
        <Radio value={0}>自定义模板</Radio>
        {modelType === 0 ? (
          <div className="model-select-custom">
            {modelImageUrl ? (
              <div className="image-sortable__item">
                <img src={modelImageUrl} />
                <a className="close-modal small" onClick={() => handleItemDelete()}>
                  ×
                </a>
              </div>
            ) : (
              <Upload
                materials={true}
                type="image"
                tokenUrl={`${window._global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`}
                maxAmount={1}
                accept={accept}
                kdtId={window._global.kdtId}
                onSuccess={onUploadSuccess}
                className="model-select-upload"
              />
            )}
            {!isValid && <FormError>请选择自定义模版</FormError>}
            <div className="model-select-desc desc-info">
              点击上传你制作完成的海报图片，建议尺寸1080*1920，支持JPG、PNG格式，图片小于1M。
              <DownloadImage text="下载海报示例" url={downloadModelImage} />
            </div>
          </div>
        ) : (
          <br />
        )}
        <Radio value={1}>固定主题海报模板</Radio>
      </RadioGroup>
    </div>
  );
}

export default function ModelField() {
  const [isValid] = useStoreByValidFlag('modelSelect');
  const className = isValid ? '' : 'has-error';
  return (
    <FormField
      className={className}
      name="templateType"
      label="模板设置："
      defaultValue={0}
      required
    >
      {() => <ModelSelect />}
    </FormField>
  );
}
