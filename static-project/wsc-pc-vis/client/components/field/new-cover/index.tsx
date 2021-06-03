import { Form } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Icon } from 'zent';
import classnames from 'classnames';
import { Upload } from '@youzan/react-components';
import './style.scss';
import { SCENES } from '@youzan/ckt-design';
import { isEduSingleStore } from '@youzan/utils-shop';

const { getControlGroup } = Form;

const defaultProps = {
  accept: 'image/jpeg, image/png, image/bmp, image/gif',
  extraComponent: null as React.ReactNode,
  maxAmount: 1,
  needDetail: false,
  triggerClassName: 'rc-upload-trigger',
  ckt: false,
  needHoverDelete: false,
  needBlur: false,
  onCoverImgClick: () => {},
  previewComponent: null as React.ReactNode,
};

// 图片详情
interface ICoverDetail {
  picture: {
    id: number;
    width: number;
    height: number;
    cover: string;
    attachment_full_url: string;
    attachment_id: number;
  };
  cover: string;
}

type CoverValueType = string | string[] | ICoverDetail | ICoverDetail[];

interface ICoverBaseProps<T extends CoverValueType, N = false, M = 1> {
  uploadCls?: string;
  needDetail: N;
  maxAmount: M;
  value: T;
  extraComponent?: React.ReactNode;
  onChange: (value: CoverValueType) => void;
  maxSize?: number;
  ckt: boolean;
  tips?: React.ReactNode;
}

type CoverBaseProps = ICoverBaseProps<string>;
type CoverDetailProps = ICoverBaseProps<ICoverDetail, true>;
type CoverMutilProps = ICoverBaseProps<string[], false, 1> & {
  needHoverDelete?: boolean;
  needBlur?: boolean;
  onCoverImgClick?: () => void;
  previewComponent?: React.ReactNode;
};
type CoverMutilDetailProps = ICoverBaseProps<ICoverDetail[], true, number>;

type CoverProps = typeof defaultProps &
  (CoverBaseProps | CoverDetailProps | CoverMutilProps | CoverMutilDetailProps);

class CoverWrap extends Component<CoverProps, {}> {
  public static readonly defaultProps = defaultProps;

  public onUploadSuccess = data => {
    const { value, needDetail, maxAmount } = this.props;

    const pics = data.map(pic => {
      const url = pic.attachment_url.replace('http://', 'https://');
      return {
        cover: url,
        picture: {
          attachment_full_url: url,
          attachment_id: pic.attachment_id,
          cover: url,
          height: pic.height,
          id: pic.attachment_id,
          width: pic.width,
        },
      };
    });

    if (maxAmount > 1) {
      let pre = value as ICoverDetail[];
      if (needDetail) {
        pre = pre.concat(pics);
      } else {
        pre = pre.concat(pics.map(pic => pic.cover));
      }
      this.props.onChange(pre);
    } else {
      const pic = pics[0];
      if (needDetail) {
        this.props.onChange(pic);
      } else {
        this.props.onChange(pic.cover);
      }
    }
  };

  public onPicDelete = i => {
    const pics = this.props.value as ICoverDetail[];
    const nextPics = [
      ...pics.slice(0, i),
      ...pics.slice(i + 1),
    ];
    this.props.onChange(nextPics);
  };

  public onSinglePicDelete = () => {
    this.props.onChange('');
  }

  // 单张图预览
  public renderPreview() {
    const { value, needDetail } = this.props;
    let src;
    if (needDetail) {
      src = (value as ICoverDetail).cover;
    } else {
      src = value;
    }

    return (
      <div className="cover-img">
        <img src={src} alt="封面" />
      </div>
    );
  }

  public renderUpload(src: string) {
    const { accept, extraComponent, ckt, tips, needHoverDelete,
      needBlur, onCoverImgClick, previewComponent, maxSize = 3 } = this.props;

    const uploadCls = classnames({
      'upload-cover-ele': true,
      [this.props.uploadCls!]: true,
    });

    let triggerClassName = 'rc-upload-trigger';

    if (src) {
      triggerClassName = 'upload-text-trigger';
    }

    const cktConfig = ckt
      ? {
        ckt: isEduSingleStore,
        cktProps: {
          auth: true,
          scene: SCENES.COURSE_COVER,
          chuangKitDesignOption: {
            show_history_design: 1,
          },
        },
      }
      : {};

    return (
      <>
        <div className="upload-cover-wrapper">
          {!!src && (
            <>
              <div className="img-container">
                {needHoverDelete
                  ? <span className="hover-close" onClick={() => this.onSinglePicDelete()}>
                    <Icon type="close-circle" />
                  </span>
                  : null
                }
                <div className="cover-img" onClick={onCoverImgClick}>
                  {needBlur
                    ? <>
                      <img className="img-blur" src={src} alt="img-blur" />
                      <img src={src} alt="封面" />
                    </>
                    : <img src={src} alt="封面" />
                  }
                </div>
              </div>
              {previewComponent}
            </>
          )}
          <Upload
            materials={true}
            type="image"
            className={uploadCls}
            maxSize={maxSize * 1024 * 1024}
            tokenUrl={`${window._global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`}
            fetchUrl={`${window._global.url.materials}/shop/fetchPubImg.json`}
            maxAmount={1}
            triggerClassName={triggerClassName}
            // trigger={renderTrigger}
            accept={accept}
            kdtId={window._global.kdtId}
            onSuccess={this.onUploadSuccess}
            {...cktConfig}
          />
          {extraComponent}
        </div>
        {tips}
      </>
    );
  }

  // 多张图预览
  public renderMultiUpload(srcs: string[]) {
    const { maxAmount, accept, triggerClassName, extraComponent, ckt, tips, maxSize } = this.props;

    const uploadCls = classnames({
      'upload-cover-ele': true,
      [this.props.uploadCls!]: true,
    });

    const cktConfig = ckt
      ? {
        ckt: isEduSingleStore,
        cktProps: {
          auth: true,
          scene: SCENES.COURSE_COVER,
          chuangKitDesignOption: {
            show_history_design: 1,
          },
        },
      }
      : {};

    return (
      <>
        <div className="upload-cover-wrapper">
          {srcs.map((src, i) => {
            return (
              <div key={src} className="cover-item">
                <div className="cover-img">
                  <span className="attfix-close" onClick={() => this.onPicDelete(i)}>
                    <Icon type="close-circle" />
                  </span>
                  <img src={src} alt="封面" />
                </div>
              </div>
            );
          })}
          {srcs.length < maxAmount && (
            <Upload
              materials={true}
              type="image"
              className={uploadCls}
              tokenUrl={`${window._global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`}
              fetchUrl={`${window._global.url.materials}/shop/fetchPubImg.json`}
              maxSize={maxSize ? maxSize * 1024 * 1024 : undefined}
              maxAmount={maxAmount - srcs.length}
              triggerClassName={triggerClassName}
              accept={accept}
              kdtId={window._global.kdtId}
              onSuccess={this.onUploadSuccess}
              {...cktConfig}
            />
          )}
          {extraComponent}
        </div>
        {tips}
      </>
    );
  }

  public render() {
    const { maxAmount, needDetail, value } = this.props;

    if (maxAmount > 1) {
      let srcs: string[];
      if (needDetail) {
        srcs = (value as ICoverDetail[]).map(detail => detail.cover);
      } else {
        srcs = value as string[];
      }
      return this.renderMultiUpload(srcs);
    } else {
      let src: string;
      if (needDetail) {
        src = (value as ICoverDetail).cover;
      } else {
        src = value as string;
      }
      return this.renderUpload(src);
    }
  }
}

export default getControlGroup(CoverWrap as any);
export { CoverWrap };
