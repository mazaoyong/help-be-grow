import { Pop } from '@zent/compat';
import React, { FC, useCallback } from 'react';
import { Checkbox, Dialog } from 'zent';
import { Img } from '@youzan/ebiz-components';
import { CoverWrap } from 'components/field/new-cover';
import cx from 'classnames';

import { oldStudentPoster, ActivityVersion } from '../../../../types';
import './styles.scss';

const { ImgWrap } = Img;
const { openDialog } = Dialog;

const ImageConfig = {
  [ActivityVersion.two]: {
    exampleImages: [
      ['//b.yzcdn.cn/public_files/4352f24b110f28efc1e4c7280c91fe60.png', '样式一'],
      ['//b.yzcdn.cn/public_files/41f3fe60eda8df028718c658a951dfde.png', '样式二'],
      ['//b.yzcdn.cn/public_files/9d7e59940fdeecbb5da82c7c41aad291.png', '样式三'],
    ],
    customExampleImage: '//b.yzcdn.cn/public_files/ef5adf6197269cf399ad67956aa43a00.png',
    psdFile: '//b.yzcdn.cn/public_files/f270b38aab111ded7d5d12bb8acb85a9.psd',
    imgHover: '//b.yzcdn.cn/public_files/e5f33118b1c58f5ff6ad951fcb1514b3.png'
  },
  [ActivityVersion.one]: {
    exampleImages: [
      ['//b.yzcdn.cn/public_files/2a624c130837d2503e8199777e732358.png', '样式一'],
      ['//b.yzcdn.cn/public_files/67e8434f05e107de9eb0bda2dad8b5bf.png', '样式二'],
    ],
    customExampleImage: '//b.yzcdn.cn/public_files/449ca534b487478d147f44827a89f84e.png',
    psdFile: '//b.yzcdn.cn/public_files/2020/08/24/转介绍自定义海报模板.psd',
    imgHover: '//b.yzcdn.cn/public_files/4a71180d300b6eaf75de3ba7d8e0d9c1.png'
  },
  [ActivityVersion.zero]: {
    exampleImages: [
      ['//b.yzcdn.cn/public_files/2a624c130837d2503e8199777e732358.png', '样式一'],
      ['//b.yzcdn.cn/public_files/67e8434f05e107de9eb0bda2dad8b5bf.png', '样式二'],
    ],
    customExampleImage: '//b.yzcdn.cn/public_files/449ca534b487478d147f44827a89f84e.png',
    psdFile: '//b.yzcdn.cn/public_files/2020/08/24/转介绍自定义海报模板.psd',
    imgHover: '//b.yzcdn.cn/public_files/4a71180d300b6eaf75de3ba7d8e0d9c1.png'
  }
};
export interface IOldstudentPosterValue {
  list: number[];
  upload: string | string[];
}

interface IOldStudentPosterField {
  value: IOldstudentPosterValue;
  activityVersion: number;
  onChange: (IOldstudentPosterValue) => void;
  disabled?: boolean;
}

const OldStudentPosterField: FC<IOldStudentPosterField> = ({
  value,
  activityVersion = ActivityVersion.two,
  onChange,
  ...restProps
}) => {
  const { list = [], upload = '' } = value;
  const { disabled } = restProps;
  const defaultBgChecked = list.includes(1);
  const customBgChecked = list.includes(2);

  const onDefaultBgCheckStatusChange = useCallback(
    e => {
      if (e.target.checked && customBgChecked) {
        onChange({ list: [oldStudentPoster.custom, oldStudentPoster.default], upload });
      } else if (e.target.checked && !customBgChecked) {
        onChange({ list: [oldStudentPoster.default] });
      } else if (!e.target.checked && customBgChecked) {
        onChange({ list: [oldStudentPoster.custom], upload });
      } else {
        onChange({ list: [] });
      }
    },
    [customBgChecked, onChange, upload],
  );

  const onCustomBgCheckStatusChange = useCallback(
    e => {
      if (defaultBgChecked && e.target.checked) {
        onChange({ list: [oldStudentPoster.custom, oldStudentPoster.default] });
      } else if (defaultBgChecked && !e.target.checked) {
        onChange({ list: [oldStudentPoster.default] });
      } else if (!defaultBgChecked && e.target.checked) {
        onChange({ list: [oldStudentPoster.custom] });
      } else {
        onChange({ list: [] });
      }
    },
    [defaultBgChecked, onChange],
  );

  const onSelectedImageChange = useCallback(
    value => {
      if (customBgChecked) {
        if (!value) {
          onChange({ list });
        } else {
          onChange({ list, upload: [value] });
        }
      }
    },
    [list, customBgChecked, onChange],
  );

  const openPreview = useCallback(() => {
    openDialog({
      title: '自定义背景图效果预览',
      style: {
        width: '506px',
        height: '675px',
      },
      children: (
        <div className="preview-img-container">
          <img className="hover" src={ImageConfig[activityVersion].imgHover} alt="" />
          <ImgWrap width="300px" height="418px" src={upload && upload[0]} alt="自定义背景图" />
        </div>
      ),
    });
  }, [activityVersion, upload]);

  return (
    <div>
      <div className="default-background">
        <Checkbox
          disabled={disabled}
          checked={Boolean(defaultBgChecked)}
          onChange={onDefaultBgCheckStatusChange}
        >
          默认背景图
        </Checkbox>
        <Pop
          trigger="hover"
          content={
            <div className="example-pop">
              {ImageConfig[activityVersion].exampleImages.map(([imageUrl, desc], index) => (
                <div className="groups" key={index}>
                  <ImgWrap
                    width="179px"
                    height="249px"
                    src={imageUrl}
                    alt="图片示例"
                    backgroundColor="#FFF"
                  />
                  <span className="desc">{desc}</span>
                </div>
              ))}
            </div>
          }
        >
          <span className="default-background-example ml-8">查看示例</span>
        </Pop>
      </div>
      <div>
        <Checkbox
          disabled={disabled}
          checked={Boolean(customBgChecked)}
          onChange={onCustomBgCheckStatusChange}
        >
          自定义背景图
        </Checkbox>
      </div>
      {customBgChecked ? (
        <div className={cx('customised-background', { disabled })}>
          <CoverWrap
            needDetail={false}
            maxAmount={1}
            value={upload as string[]}
            onChange={value => {
              onSelectedImageChange(value);
            }}
            ckt={false}
            tips={
              <div className="desc">
                建议尺寸600*832px，JPG、PNG格式。
                <Pop
                  trigger="hover"
                  content={
                    <ImgWrap width="196px" height="274px" src={ImageConfig[activityVersion].customExampleImage} alt="图片示例" />
                  }
                >
                  <span className="default-background-example">查看示例</span>
                </Pop>
                <span className="seperator">|</span>
                <a
                  className="default-background-example"
                  href={ImageConfig[activityVersion].psdFile}
                  download="转介绍自定义海报模板"
                >
                  下载海报设计稿
                </a>
              </div>
            }
            needHoverDelete
            needBlur
            onCoverImgClick={openPreview}
            previewComponent={
              upload && upload.length ? (
                <div className="operation-container">
                  <span className="operation" onClick={openPreview}>
                    预览
                  </span>
                </div>
              ) : null
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default OldStudentPosterField;
