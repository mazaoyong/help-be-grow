import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { ComponentTitle, EditorCard } from '../../../common';
import { isExpectedDesginType } from '../../utils/design-type';
import find from 'lodash/find';
import get from 'lodash/get';

import './index.scss';

interface IProps {
  comList: any;
  comBriefInfoList: object[];
  instList: any;
  onChange: (any) => void;
  onClearAllInsts: () => void;
  onClickComChild: (index: number) => void;
  onDeleteInst: (index: number) => void;
}

export default class ComsManager extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  /**
   * 编辑区值改变
   * @param {Object} list: 拖拽区的数据
   */
  handleChange(list) {
    this.props.onChange({
      instList: list,
    });
  }

  handleClear() {
    this.props.onClearAllInsts();
  }

  clickComChild(index) {
    this.props.onClickComChild(index);
  }

  handleDelete(index) {
    // 因为去掉了config 组件，所以index 需要+1
    this.props.onDeleteInst(index + 1);
  }

  checkInstCanDrag(newInstList, index) {
    const { comList = [] } = this.props;
    const inst = get(newInstList, `${index}`);
    // 选择对应的编辑器
    const valueType = inst.type;
    const com = find(comList, com => isExpectedDesginType(com, valueType));
    if ((inst && inst.type === 'contact_us') || com.sticky) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { instList = [], comBriefInfoList = [], comList = [] } = this.props;
    // 去除 config组件
    const newInstList = [...instList];
    const configIndex = newInstList.findIndex(component => component.type === 'config');
    newInstList.splice(configIndex, 1);

    // 联系客服组件提取出来,放到第一个
    // 针对客服组件做的hack
    const contactUsIndex = newInstList.findIndex(component => component.type === 'contact_us');
    if (contactUsIndex > -1) {
      const [contactUsComponent] = newInstList.splice(contactUsIndex, 1);
      newInstList.unshift(contactUsComponent);
    }

    // 组件名称
    const getItemName = type => {
      const comBriefInfo = find(comBriefInfoList, c => isExpectedDesginType(c, type));
      return get(comBriefInfo, 'name', '未支持的组件');
    };

    const hasInst = newInstList.length > 0;
    return (
      <div className="decorate-component-coms-manager">
        <ComponentTitle name="组件管理" />
        {hasInst && (
          <div className="clear-action">
            <Pop
              position="left-center"
              trigger="click"
              content="确定清除组件？"
              onConfirm={this.handleClear.bind(this)}
            >
              <span className="clear-action-text">清除组件</span>
            </Pop>
          </div>
        )}
        {hasInst ? (
          <EditorCard
            className="decorate-component-coms-manager-editor-item-wrapper"
            list={newInstList}
            canDelete={false}
            canAdd={false}
            canDrag={this.checkInstCanDrag.bind(this, newInstList)}
            onChange={this.handleChange.bind(this)}
          >
            {newInstList.map((item, index) => {
              // 选择对应的编辑器
              const valueType = item.type;
              const com = find(comList, com => isExpectedDesginType(com, valueType));
              if (item.type === 'contact_us' || com.sticky) {
                return (
                  <div
                    className="decorate-component-coms-manager-child decorate-component-coms-manager-contact-us"
                    key={index}
                  >
                    <i className="decorate-component-coms-manager-child-lock" />
                    {getItemName(item.type)}
                    <div className="decorate-component-coms-manager-child-notice">
                      该组件不支持排序
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className="decorate-component-coms-manager-child"
                    key={index}
                    onClick={this.clickComChild.bind(this, index)}
                  >
                    <i className="decorate-component-coms-manager-child-drag" />
                    {getItemName(item.type)}
                    <Pop
                      position="left-center"
                      trigger="click"
                      content="确定清除组件？"
                      onConfirm={this.handleDelete.bind(this, index)}
                    >
                      <i className="decorate-component-coms-manager-child-delete" />
                    </Pop>
                  </div>
                );
              }
            })}
          </EditorCard>
        ) : (
          <div className="decorate-component-coms-manager__none_com">
            <img
              src="https://img.yzcdn.cn/public_files/2019/03/04/519dcf2c736ed6dc8412bf6836cb405d.png?imageView2/2/w/150/h/0/q/100/format/png"
              alt="none-com"
              className="none-image"
            />
            暂无组件
          </div>
        )}
      </div>
    );
  }
}
