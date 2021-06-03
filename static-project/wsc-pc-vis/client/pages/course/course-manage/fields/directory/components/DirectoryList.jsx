
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import DirectoryFirstItem from './DirectoryFirstItem';
import { isInStoreCondition } from 'fns/chain';

const { getControlGroup } = Form;

class DirectoryListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directoryList: [],
      value: [],
    };
  }

  // 添加一级目录
  onAddDirectory = () => {
    let value = [...this.props.value.directoryList];
    let directoryItemDefault = {
      courseId: 0,
      serialNo: 0,
      title: '',
      sectionList: [],
    };
    directoryItemDefault.serialNo = value.length;
    value.push(directoryItemDefault);
    this.setState({
      directoryList: value,
    });
    this.props.onChange({ directoryList: value, changeDirectory: true });
    // this.props.onChange(value);
  };

  onFirstDirectoryDelete = id => {
    let value = [...this.props.value.directoryList];
    value.map((item, index) => {
      if (item.serialNo === id) {
        value.splice(index, 1);
      }
    });
    this.setState({
      directoryList: value,
    });
    this.props.onChange({ directoryList: value, changeDirectory: true });
    // this.props.onChange(value);
  };

  // 添加二级目录
  onAddContent = (data, id) => {
    let value = [...this.props.value.directoryList];
    value.map(item => {
      if (item.serialNo === id) {
        item.sectionList.push(data);
      }
    });
    this.setState({
      directoryList: value,
    });
    this.props.onChange({ directoryList: value, changeDirectory: true });
    // this.props.onChange(value);
  };

  // 删除二级目录
  onContentDelete = (firstId, secondId) => {
    let value = [...this.props.value.directoryList];
    value.map(item => {
      if (item.serialNo === firstId) {
        item.sectionList.map((sitem, index) => {
          if (sitem.serialNo === secondId) {
            item.sectionList.splice(index, 1);
          }
        });
      }
    });
    this.setState({
      directoryList: value,
    });
    this.props.onChange({ directoryList: value, changeDirectory: true });
    // this.props.onChange(value);
  };

  onUpdateDirectory = directoryItem => {
    let value = [...this.props.value.directoryList];
    value.map(item => {
      // eslint-disable-next-line no-self-compare
      if (item.serialNo === item.serialNo) {
        item = directoryItem;
      }
    });
    this.setState({
      directoryList: value,
    });
    this.props.onChange({ directoryList: value, changeDirectory: true });
    // this.props.onChange(value);
  };

  render() {
    let value = this.props.value.directoryList;
    // let directoryList = this.state.directoryList.length > 0 ? this.state.directoryList : value;
    let directoryList = value;
    return (
      <ul
        className={cx('add-directory-wrap', {
          border: directoryList.length > 0,
        })}
      >
        {directoryList.length > 0 &&
          directoryList.map((item, index) => {
            return (
              <DirectoryFirstItem
                key={index}
                directory={item}
                onAddContent={this.onAddContent}
                onFirstDirectoryDelete={this.onFirstDirectoryDelete}
                onContentDelete={this.onContentDelete}
                onUpdateDirectory={this.onUpdateDirectory}
              />
            );
          })}
        <div
          className={cx(isInStoreCondition({ supportEduBranchStore: true }) ? 'add-btn-disable' : 'add-btn', {
            'add-directory-wrap__btn': directoryList.length > 0,
            hide: directoryList.length > 20,
          })}
          onClick={this.onAddDirectory}
        >
          +添加课程大纲
        </div>
      </ul>
    );
  }
}

export default getControlGroup(DirectoryListComponent);
