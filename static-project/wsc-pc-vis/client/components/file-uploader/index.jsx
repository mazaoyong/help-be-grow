import React, { Component } from 'react';
import { Notify, ClampLines } from 'zent';
import PropTypes from 'prop-types';
import cx from 'classnames';

import uploadFile from './upload-file';

import './style.scss';

class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      size: 0,
      value: '',
    };

    // init input
    const { fileLimit, typeRegEx, tokenUrl, channel, onChange, onFail, showNotify } = props;

    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.onchange = e => {
      const file = e.target.files[0];
      if (typeRegEx && !typeRegEx.test(file.name)) {
        showNotify && Notify.error('文件格式错误');
        onFail('文件格式错误');
        return;
      }
      if (fileLimit && file.size > fileLimit * 1024 * 1024) {
        showNotify && Notify.error(`文件不能大于${fileLimit}MB`);
        onFail(`文件不能大于${fileLimit}MB`);
        return;
      }
      uploadFile(file, {
        tokenUrl,
        channel,
      })
        .then(data => {
          onChange({ value: data, size: file.size });
          this.setState({
            name: file.name,
            size: file.size,
            value: data,
          });
          showNotify && Notify.success('上传成功');
        }).catch(err => {
          showNotify && Notify.error(err);
          onFail(err);
        });
    };
  }

  static propTypes = {
    className: PropTypes.string,
    fileLimit: PropTypes.number,
    typeRegEx: PropTypes.object,
    tokenUrl: PropTypes.string,
    channel: PropTypes.string,
    onChange: PropTypes.func,
    onFail: PropTypes.func,
    showNotify: PropTypes.bool,
    uploadText: PropTypes.string,
    clamp: PropTypes.bool,
    clampWidth: PropTypes.number,
    showSize: PropTypes.bool,
    uploadFirst: PropTypes.bool,
  };

  static defaultProps = {
    tokenUrl: '//www.youzan.com/v4/vis/commom/material/getPrivateFileUploadToken.json',
    onChange: () => {},
    onFail: () => {},
    showNotify: true,
    uploadText: '点击上传文件',
    clamp: false,
    clampWidth: 180,
    showSize: true,
    uploadFirst: true,
  };

  handleUpload = () => {
    this.input.click();
  };

  cutName = name => {
    const nameArr = name.split('.');
    const len = nameArr.length;
    if (len > 1) {
      return [nameArr.pop(), nameArr.join('.')];
    }
    return ['', name];
  }

  render() {
    const {
      className,
      uploadText,
      clamp,
      clampWidth,
      showSize,
      uploadFirst,
    } = this.props;
    const { name, size, value } = this.state;
    return (
      <div className={cx('file-uploader', className)}>
        {!uploadFirst && (this.props.children ? this.props.children : (
          <div className="file-uploader__desc">
            <p>当前仅支持 csv 格式文件（大小在2M以内），请使用 Office 2010 及以上版本，否则可能出现乱码</p>
            <p>必须严格按照模板内容填入数据，否则可能会出现导入异常</p>
          </div>
        ))}

        {!value ? (
          <a href="javascript:void(0);" onClick={this.handleUpload}>
            {uploadText}
          </a>
        ) : null}

        {value ? (
          showSize
            ? <div className="file-uploader__file">
              <a href="javascript:void(0);" onClick={this.handleUpload}>
                {clamp
                  ? <div style={{ maxWidth: clampWidth }}>
                    <ClampLines
                      lines={1}
                      text={name}
                    />
                  </div>
                  : name
                }
              </a>
              <span>{size}B</span>
            </div>
            : <div className="file-uploader__file-flex">
              {clamp
                ? <div style={{ maxWidth: clampWidth }}>
                  <ClampLines
                    lines={1}
                    popWidth={368}
                    text={name}
                    ellipsis={`...${this.cutName(name)[0]}`}
                  />
                </div>
                : <span>{name}</span>
              }
              <span className="action" onClick={this.handleUpload}>重新选择</span>
            </div>
        ) : null}
        {uploadFirst && (this.props.children ? this.props.children : (
          <div className="file-uploader__desc">
            <p>当前仅支持 csv 格式文件（大小在2M以内），请使用 Office 2010 及以上版本，否则可能出现乱码</p>
            <p>必须严格按照模板内容填入数据，否则可能会出现导入异常</p>
          </div>
        ))}
      </div>
    );
  }
}

export default FileUploader;
