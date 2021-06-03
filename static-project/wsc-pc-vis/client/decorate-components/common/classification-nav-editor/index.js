import React, { Component } from 'react';
import { ControlGroup } from '@zent/design/es/editor/DesignEditor';
import isArray from 'lodash/isArray';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';

import EditorCard from '../editor-card/EditorCard';
import ClassificationItem from './ClassificationItem';

import './style/index.scss';

export default class ClassificationNavEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 0,
    };
  }

  // 添加分类
  onAdd = () => {
    const { categoryList, onChange } = this.props;
    const classificationNavs = cloneDeep(categoryList);

    // 最新添加的分组展开
    this.setState({
      activeKey: classificationNavs.length,
    });

    classificationNavs.push({
      title: '',
      subCategoryList: [],
    });
    onChange(classificationNavs);
  };

  // 删减分类
  handleChange = list => {
    const { onChange } = this.props;
    onChange(list);
  };

  // 某个分类active
  handleChangeCollapse = activeKey => {
    this.setState({
      activeKey,
    });
  };

  /**
   * 更新某个分类的数据：
   * {title: '', subCategoryList: []}
   */
  handleItemChange = (data, index) => {
    const { onChange, categoryList } = this.props;
    const targetItem = categoryList[index];
    const newItem = assign({}, targetItem, data);
    categoryList.splice(index, 1, newItem);
    onChange(categoryList);
  };

  render() {
    const {
      categoryList,
      canAdd = false,
      canDelete = true,
      showError,
      error,
      globalConfig,
      settings,
      linkMenuItems,
    } = this.props;
    const { activeKey } = this.state;
    const { categoryListError, subCategoryListError } = error;

    return (
      <ControlGroup
        showLabel={false}
        showError={showError}
        error={categoryListError}
        focusOnLabelClick={false}
        className="rc-design-component-classification-nav-control-group"
      >
        <EditorCard
          list={categoryList}
          canAdd={canAdd}
          onAdd={this.onAdd}
          addText="添加一个主分类"
          onChange={this.handleChange}
          canDelete={canDelete}
          canDrag={false}
        >
          {categoryList.map((item, index) => {
            return (
              <ClassificationItem
                linkMenuItems={linkMenuItems}
                globalConfig={globalConfig}
                settings={settings}
                showError={showError}
                error={isArray(subCategoryListError) ? subCategoryListError[index] : undefined}
                key={index}
                index={index}
                onChange={this.handleItemChange}
                mainClassData={item}
                activeKey={activeKey}
                onChangeActiveKey={this.handleChangeCollapse}
              />
            );
          })}
        </EditorCard>
      </ControlGroup>
    );
  }
}
