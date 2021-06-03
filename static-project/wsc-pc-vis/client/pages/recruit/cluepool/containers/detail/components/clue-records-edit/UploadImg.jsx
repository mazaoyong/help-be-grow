import { Pop } from '@zent/compat';
import React from 'react';
import { Upload } from '@youzan/react-components';
import { Icon as EbizIcon } from '@youzan/ebiz-components';

const UploadImg = ({ selectedLength, onUploadSuccess }) => {
  if (selectedLength === 9) {
    return (
      <Pop trigger="hover" content="已选择9张图片">
        <dl className="gray trigger">
          <dt><EbizIcon type="picture-o" size="16px" color="#999999" /></dt>
          <dd>图片</dd>
        </dl>
      </Pop>
    );
  }

  return (
    <Upload
      materials={true}
      type="image"
      className=""
      tokenUrl={`${window._global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`}
      fetchUrl={`${_global.url.materials}/shop/fetchPubImg.json`}
      maxAmount={9 - selectedLength}
      triggerClassName="trigger"
      accept="image/jpeg, image/png, image/bmp, image/gif"
      kdtId={window._global.kdtId}
      onSuccess={onUploadSuccess}
    >
      <Pop trigger="hover" content={`还可选择${9 - selectedLength}张图片`}>
        <dl className="cursor-link">
          <dt><EbizIcon type="picture-o" size="16px" color="#999999" /></dt>
          <dd>图片</dd>
        </dl>
      </Pop>
    </Upload>
  );
};

export default UploadImg;
