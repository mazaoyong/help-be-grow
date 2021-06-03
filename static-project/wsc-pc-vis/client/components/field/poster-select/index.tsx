import React, { FC, useCallback } from 'react';
import { Radio, RadioGroup, Dialog } from 'zent';
import { Img } from '@youzan/ebiz-components';
import { CoverWrap } from '../new-cover';
import cx from 'classnames';

import './styles.scss';

const { ImgWrap } = Img;
const { openDialog } = Dialog;

enum BackgroundTypeEnum {
  default = 0, // 默认背景图
  customised, // 自定义背景图
}

type previewMode = '3:4' | '9:16';

const imgHover = '//b.yzcdn.cn/public_files/4a71180d300b6eaf75de3ba7d8e0d9c1.png';

interface IFieldValue {
  backgroundType: BackgroundTypeEnum;
  backgroundUrl?: string;
}

interface IPosterSelectField {
  value: IFieldValue;
  onChange: (value: IFieldValue) => void;
  disabled?: boolean;
  tips?: React.ReactNode;
  previewMode?: previewMode;
  imageHover?: string;
  defaultBgExample?: React.ReactNode;
}

const PosterSelectField: FC<IPosterSelectField> = ({ value, onChange, ...restProps }) => {
  const { backgroundType, backgroundUrl = '' } = value;
  const { disabled, tips, imageHover, defaultBgExample, previewMode = '3:4' } = restProps;

  const onBackgroundTypeChange = useCallback((e) => {
    const value: BackgroundTypeEnum = e.target.value;
    if (e.target.value === BackgroundTypeEnum.default) {
      onChange({ backgroundType: value });
    } else {
      onChange({ backgroundType: value, backgroundUrl });
    };
  }, [onChange, backgroundUrl]);

  const onSelectedImageChange = useCallback((value) => {
    if (backgroundType === BackgroundTypeEnum.default) {
      onChange({ backgroundType });
    } else {
      onChange({ backgroundType, backgroundUrl: value });
    };
  }, [backgroundType, onChange]);

  const openPreview = useCallback(() => {
    openDialog({
      title: '自定义背景图效果预览',
      style: {
        width: '506px',
        height: '675px',
      },
      children: (
        <div className="preview-img-container">
          <img
            className={cx('hover', { 'tf': previewMode === '3:4', 'ns': previewMode === '9:16' })}
            src={imageHover || imgHover}
            alt=""
          />
          <ImgWrap
            width={previewMode === '3:4' ? '300px' : '250px'}
            height={previewMode === '3:4' ? '418px' : '445px'}
            src={backgroundUrl}
            alt="自定义背景图"
          />
        </div>
      ),
    });
  }, [backgroundUrl, imageHover, previewMode]);

  return (
    <div>
      <RadioGroup onChange={onBackgroundTypeChange} value={backgroundType} disabled={disabled}>
        <div className="default-background">
          <Radio value={BackgroundTypeEnum.default}>
            默认背景图
          </Radio>
          {defaultBgExample}
        </div>
        <div>
          <Radio value={BackgroundTypeEnum.customised}>
            自定义背景图
          </Radio>
        </div>
        {backgroundType === BackgroundTypeEnum.customised ? (
          <div className={cx('customised-background', { disabled })}>
            <CoverWrap
              needDetail={false}
              maxAmount={1}
              value={backgroundUrl}
              onChange={(value) => {
                onSelectedImageChange(value);
              }}
              ckt={false}
              tips={tips || ''}
              needHoverDelete
              needBlur
              onCoverImgClick={openPreview}
              previewComponent={
                backgroundUrl ? (
                  <div className="operation-container">
                    <span className="operation" onClick={openPreview}>预览</span>
                  </div>
                ) : null
              }
            />
          </div>
        ) : null}
      </RadioGroup>
    </div>
  );
};

export default PosterSelectField;
