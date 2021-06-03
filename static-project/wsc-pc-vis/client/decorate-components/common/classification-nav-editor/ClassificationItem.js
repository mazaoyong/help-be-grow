import React, { Component } from 'react';
import { ControlGroup } from '@zent/design/es/editor/DesignEditor';
import { Icon, Input, Sortable } from 'zent';
import cx from 'classnames';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import assign from 'lodash/assign';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';

import Image from '../upload-image';
import SubEntryItem from '../subentry-item';
import * as Helper from './helper';

// 子分类最大数量
const subClassMaxNum = 20;
const helpText = '该图片在小程序不显示';

export default class ClassificationItem extends Component {
  /**
   * 替换子分类
   * @param {*} data 新数据
   * @param {*} itemIndex 更新的index
   * @param {*} subEntryData 老数据
   */
  updateSubClass(changedData, itemIndex, oldData) {
    if (oldData.length > 0) {
      return map(oldData, (item, index) => {
        return index === itemIndex ? changedData : item;
      });
    }
    return oldData;
  }

  // 更新当前的子分类，调用外部更新函数
  handleChange = data => {
    const { onChange, index, mainClassData } = this.props;
    onChange(
      assign({}, mainClassData, {
        subCategoryList: data,
      }),
      index
    );
  };

  // 更新子分类
  handleItemChange = (changedData, index) => {
    const { mainClassData } = this.props;
    const { subCategoryList } = mainClassData;
    const newList = this.updateSubClass(changedData, index, subCategoryList);
    this.handleChange(newList);
  };

  // 选择完图片回调
  uploadImageCallback = data => {
    const { mainClassData } = this.props;
    let { subCategoryList } = mainClassData;
    const imageData = Helper.transferSubEntry(data);
    forEach(imageData, item => {
      subCategoryList.push(item);
    });
    subCategoryList = Helper.validSubEntry(subCategoryList, subClassMaxNum);
    this.handleChange(subCategoryList);
  };

  // 添加图片
  addImage() {
    const { globalConfig, uploadConfig } = this.props;
    const options = {
      uploadConfig,
      callback: this.uploadImageCallback,
      imgcdn: globalConfig.url && (globalConfig.url.imgqn || globalConfig.url.imgcdn),
    };
    Image.initialize(options);
  }

  // 修改分类标题
  handleInputChange = e => {
    const { onChange, index, mainClassData } = this.props;
    const title = e.target.value || '';
    const newData = assign({}, mainClassData, { title });
    onChange(newData, index);
  };

  // 是否展开分类卡片
  changeActive = () => {
    const { activeKey, index } = this.props;
    if (activeKey === index) {
      this.props.onChangeActiveKey(-1);
    } else {
      this.props.onChangeActiveKey(index);
    }
  };

  // 删除子分类
  handleDeleteItem = index => {
    const { mainClassData } = this.props;
    const { subCategoryList } = mainClassData;
    const newList = subCategoryList.slice();
    newList.splice(index, 1);
    this.handleChange(newList);
  };

  // 给list加唯一id
  setUniqueID = list => {
    forEach(list, item => {
      if (!item.id) {
        item.id = uniqueId();
      }
    });
    return list;
  };

  render() {
    const {
      index,
      mainClassData,
      settings,
      globalConfig,
      uploadConfig,
      linkMenuItems,
      activeKey,
      showError,
      error = {},
    } = this.props;
    const { titleError = {}, numberError = {}, subEntryError = [] } = error;
    const { title, subCategoryList } = mainClassData;
    const isActive = index === activeKey;
    const classificationItemClassname = cx('rc-design-component-classification-item', {
      active: isActive,
    });

    const sortableList = this.setUniqueID(subCategoryList);

    return (
      <div className={classificationItemClassname}>
        <ControlGroup
          className="classification-title-content"
          focusOnLabelClick={false}
          label={`分类${Helper.digitUppercase(index)}：`}
          showError={showError && get(titleError, 'isShowError', false)}
          error={get(titleError, 'text', '')}
        >
          <Input
            name="title"
            value={title || ''}
            onChange={this.handleInputChange}
            placeholder="最多10个字"
            maxLength={10}
          />
          <span className="caret-icon" onClick={this.changeActive}>
            <Icon type={isActive ? 'caret-up' : 'caret-down'} style={{ transform: 'scale(0.6)' }} />
          </span>
        </ControlGroup>
        <ControlGroup
          showLabel={false}
          showError={showError && get(numberError, 'isShowError', false)}
          error={get(numberError, 'text', '')}
          focusOnLabelClick={false}
          className="rc-design-component-classification-item__sub-class"
        >
          <Sortable
            items={sortableList}
            onChange={this.handleChange}
            className="rc-design-component-classification-item__sortable-content"
          >
            {sortableList.map((item, itemIndex) => (
              <div className="classification-sortable-item" key={item.id}>
                <SubEntryItem
                  linkMenuItems={linkMenuItems}
                  globalConfig={globalConfig}
                  settings={settings}
                  uploadConfig={uploadConfig}
                  index={itemIndex}
                  data={item}
                  onChange={this.handleItemChange}
                  titlePlaceholder="最多6个字"
                  titleMaxLength={6}
                  helpText={helpText}
                  showError={
                    showError &&
                    subEntryError[itemIndex] &&
                    get(subEntryError[itemIndex], 'isShowError', false)
                  }
                  error={subEntryError[itemIndex] && get(subEntryError[itemIndex], 'text', '')}
                />
                <Icon
                  className="item-delete-icon"
                  type="close-circle"
                  onClick={this.handleDeleteItem.bind(this, itemIndex)}
                />
              </div>
            ))}
            <div className="classification-sortable-add" onClick={() => this.addImage()}>
              <div className="add-image-content">
                <div className="image-text">
                  <Icon type="plus" className="rc-design-editor-card-add-icon" />
                  添加一个子分类
                </div>
                <div className="add-image-tip">
                  <div>建议尺寸 136 x 136 像素</div>
                </div>
              </div>
            </div>
          </Sortable>
        </ControlGroup>
      </div>
    );
  }
}
