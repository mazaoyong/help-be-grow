
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Notify } from 'zent';

import uploadFile from './upload-file';

import './styles.scss';

const { getControlGroup } = Form;

class FileField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.onchange = e => {
      const file = e.target.files[0];
      if (!(/.csv$/.test(file.name))) {
        Notify.error('文件格式错误');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        Notify.error('文件不能大于10MB');
        return;
      }
      uploadFile(file).then(data => {
        this.setState({
          name: file.name,
          size: file.size,
        });
        this.props.onChange({ value: data });
        Notify.success('上传成功');
      }).catch(err => {
        Notify.error(err);
      });
    };
  }

  handleUpload = () => {
    this.input.click();
  };

  handleClearInput = () => {
    this.input.value = '';
    this.props.onChange({ value: '' });
  };

  calcSize = size => {
    let level = 0;
    while (size > 1024) {
      level += 1;
      size = parseInt(size / 1024);
    }
    switch (level) {
      case 0:
        return size + 'B';
      case 1:
        return size + 'KB';
      case 2:
        return size + 'MB';
      default:
        return 'Error: Unsupported data';
    }
  };

  render() {
    const { value } = this.props;
    const { name, size } = this.state;
    return (
      <>
        {value ? (
          <div className="edu-clue-import-file">
            <div className="edu-clue-import-file__info">
              <div>文件名称：<span className="edu-clue-import-file__info-content">{name}</span></div>
              <div>文件大小：<span className="edu-clue-import-file__info-content">{this.calcSize(size)}</span></div>
            </div>
            <div className="edu-clue-import-file__actions">
              <a href="javascript:void(0);" onClick={this.handleUpload}>修改</a>
              <a href="javascript:void(0);" onClick={this.handleClearInput}>删除</a>
            </div>
          </div>
        ) : (
          <a href="javascript:void(0);" onClick={this.handleUpload}>
              点击上传文件
          </a>
        )
        }
      </>
    );
  }
}

export default getControlGroup(FileField);
