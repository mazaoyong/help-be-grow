
import React, { Component } from 'react';
import { Form } from '@zent/compat';
import { EduImageUpload, DownloadImage } from '@youzan/ebiz-components';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { posterImg } from '../../../constants';

import './index.scss';

const { Field } = Form;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;

export default class DistributorPoster extends Component {
  render() {
    const { label, distributorPics } = this.props;
    return (
      <ArthurContainer name="common.pictureMaterial" namespace="shop">
        {model => {
          const maxSize = model.maxSize ? model.maxSize / (1024 * 1024) : 3;
          return (
            <Field
              name="distributorPics"
              label={label}
              tip={
                <span className="cover-extraTips">
                  <span>
                    （最多可上传3个自定义海报）
                    <DownloadImage text="下载示意图" download="分享海报示意图" url={posterImg}></DownloadImage>
                  </span>
                  <span>
                    点击上传您制作完成的海报图片，建议尺寸750*1334或9:16比例尺寸，支持JPG、PNG格式，图片小于
                    {maxSize}M
                  </span>
                </span>
              }
              maxSize={maxSize}
              component={ImageUploadFieldWithControlGroup}
              needDetail
              className="cover-scale-square"
              uploadCls="content-upload"
              value={distributorPics}
              maxAmount={3}
              validations={{
                validData(_, value) {
                  return value.length <= 3;
                },
              }}
            />
          );
        }}
      </ArthurContainer>
    );
  }
}
