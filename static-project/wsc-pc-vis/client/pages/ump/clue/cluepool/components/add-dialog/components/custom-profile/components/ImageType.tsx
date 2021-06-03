
import { Form, IFormControlGroupProps } from '@zent/compat';
import React, { FC, useMemo, useCallback } from 'react';
import { previewImage } from 'zent';
import { Upload } from '@youzan/react-components';

import { ObjectLike } from '../index';
import '../styles/image-type.scss';

const { getControlGroup } = Form;

const ImageType: FC<IFormControlGroupProps & ObjectLike> = props => {
  const selectedImage: Array<string> = useMemo(() => {
    if (props.value) {
      if (Array.isArray(props.value)) {
        return props.value;
      }
      return [props.value];
    }
    return [];
  }, [props.value]);

  // 需要判断一下是使用onSuccess还是onChange
  const valueChange = () => {
    const { useRemote = true } = props;
    if (useRemote) {
      return {
        onSuccess: handleSuccess,
      };
    }
    return {
      localOnly: true,
      onChange: handleChange,
    };
  };

  const handleChange = data => {
    const { onChange } = props;
    if (onChange) {
      onChange(data.map(_d => _d.src));
    }
  };

  const deleteSelectedImage = remoteUrl => {
    if (selectedImage.length === 1) {
      handleChange([]);
      return void 0;
    }
    handleChange(selectedImage.filter(src => src !== remoteUrl));
  };

  const handleSuccess = data => {
    const filesURL = data.map(_d => ({ src: _d.attachment_url }));
    handleChange(filesURL);
  };

  const handlePreviewImage = useCallback(evt => {
    previewImage({
      images: selectedImage,
      index: selectedImage.indexOf(evt.target.src),
    });
  }, [selectedImage]);

  if (selectedImage.length === 0) {
    return (
      <Upload
        maxAmount={1}
        tips="仅支持jpg、gif、png三种格式，大小不超过1MB"
        // @ts-ignore
        className="image-preview"
        kdtId={window._global.kdtId}
        materials={true}
        imgcdn={'https://img.yzcdn.cn'}
        tokenUrl={`${window._global.url.materials}/shop/pubImgUploadToken.json`}
        fetchUrl={`${window._global.url.materials}/shop/fetchPubImg.json`}
        {...props}
        {...valueChange()}
      />
    );
  }

  return (
    <div className="image-preview">
      {selectedImage.map((src, index) => {
        return (
          <div key={index} className="image-preview__content">
            <img src={src} onClick={handlePreviewImage} />
            <span className="image-preview__delete" onClick={() => deleteSelectedImage(src)} />
          </div>
        );
      })}
      <p className="rc-upload-tips">{props.tips || '仅支持jpg、gif、png三种格式，大小不超过1MB'}</p>
    </div>
  );
};

export default getControlGroup(ImageType as any);
