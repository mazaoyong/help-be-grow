
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import DirectorySecondeItem from './DirectorySecondeItem';
import { isInStoreCondition } from 'fns/chain';

const { FormInputField } = Form;

class DirectoryFirstItem extends Component {
  state = {
    hideContent: false,
  };

  // 删除一级目录
  onFirstDirectoryDelete = () => {
    let { directory } = this.props;
    this.props.onFirstDirectoryDelete(directory.serialNo);
  };

  // 二级目录收缩控制
  toggleContent = () => {
    let { hideContent } = this.state;
    this.setState({
      hideContent: !hideContent,
    });
  };

  // 添加二级目录
  onAddContent = () => {
    let { directory } = this.props;
    let contentDefault = {
      serialNo: (directory.sectionList || []).length,
      title: '',
    };
    this.props.onAddContent(contentDefault, directory.serialNo);
  };

  onContentDelete = contentId => {
    let { directory } = this.props;
    this.props.onContentDelete(directory.serialNo, contentId);
  };

  updateFirstDirectory = (evt, val) => {
    let { directory } = this.props;
    directory.title = val;
    this.props.onUpdateDirectory(directory);
  };

  onUpdateContent = data => {
    let { directory } = this.props;
    directory.sectionList = data;
    this.props.onUpdateDirectory(directory);
  };

  render() {
    let { directory } = this.props;
    let { hideContent } = this.state;
    return (
      <li className="first-item">
        <div className="first-item__section">
          <FormInputField
            name="firstDirectory"
            type="text"
            className="directory-input"
            required
            maxLength={20}
            placeholder="课程大纲，20个字以内"
            value={directory.title}
            onChange={this.updateFirstDirectory}
          />
          <p className="help-inline">
            <a href="javascript:;" onClick={this.toggleContent}>
              {hideContent ? '展开' : '收起'}
            </a>
            <span> | </span>
            <a href="javascript:;" onClick={this.onFirstDirectoryDelete}>
              删除
            </a>
          </p>
        </div>

        {!hideContent &&
          directory.sectionList.length > 0 && (
          <DirectorySecondeItem
            content={directory.sectionList}
            onContentDelete={this.onContentDelete}
            onUpdateContent={this.onUpdateContent}
          />
        )}

        <div
          className={cx(`first-item__add-content-btn ${isInStoreCondition({ supportEduBranchStore: true }) ? 'first-item__no-click' : ''}`, {
            hide: directory.sectionList.length >= 20 || hideContent,
          })}
          onClick={this.onAddContent}
        >
          +添加上课内容
        </div>
      </li>
    );
  }
}

export default DirectoryFirstItem;
