import React, { useCallback, useEffect } from 'react';
import { Radio, FormError } from 'zent';
import { Upload } from '@youzan/react-components';
import { useStoreRelatedContent, useStoreByValidFlag } from '../../store';
import { RELATED_TYPE } from '../../contants';
import { fullfillImage, url as ZanUrl } from '@youzan/utils';

interface IRelatedContentFixedCodeProps {
  onRadioChange: (e: any) => void;
}

export default function RelatedContentFixedCode(props: IRelatedContentFixedCodeProps) {
  const { onRadioChange } = props;
  const [formData, dispatch] = useStoreRelatedContent();
  const [isValid, setValid] = useStoreByValidFlag('relatedSelect');
  const { relatedType, fixedQrcode = '', resourceAlias = '' } = formData;

  useEffect(() => {
    if (fixedQrcode) {
      setValid(true);
    }
  }, [fixedQrcode, setValid]);

  const onUploadSuccess = useCallback(
    data => {
      const image = data.map(item => {
        return {
          id: item.attachmentId || item.attachment_id,
          url: item.attachmentUrl || item.attachment_url,
          width: item.width,
          height: item.height,
        };
      });
      if (image.length < 1) return;
      const url = image[0].url;
      dispatch('fixedQrcode', url, ZanUrl.args.add(url, { resourceAlias }));
    },
    [dispatch, resourceAlias],
  );
  const handleItemDelete = () => {
    dispatch('fixedQrcode', '', '');
  };
  return (
    <>
      <Radio onChange={onRadioChange} checked={relatedType === RELATED_TYPE.FIXEDQRCODE}>
        固定二维码
      </Radio>
      {relatedType === RELATED_TYPE.FIXEDQRCODE ? (
        <div className="related-content-qrcode left-tab">
          {fixedQrcode ? (
            <div className="image-sortable__item normal-size">
              <img src={fullfillImage(fixedQrcode, '!80x80.jpg')} />
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
              kdtId={window._global.kdtId}
              onSuccess={onUploadSuccess}
              className="model-select-upload normal-size"
            />
          )}
          {!isValid && <FormError>请选择固定二维码</FormError>}
          <div className="desc-info">图片尺寸150*150px，小于1M。</div>
        </div>
      ) : (
        <br />
      )}
    </>
  );
}
