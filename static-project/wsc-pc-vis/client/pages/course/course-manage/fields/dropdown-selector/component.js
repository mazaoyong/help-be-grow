import React, { Component, PureComponent } from 'react';
// import { Select } from 'zent';
import PopupTips from './PopupTips';
// import Select from 'react-select';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import getControlGroup from '../ControlGroup';
import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import get from 'lodash/get';

// const { Option } = Select;

class DropdownSelector extends (Component || PureComponent) {
  componentDidUpdate(prevProps) {
    if (this.props.disabled) return;

    if (!this._hasFetchOption) return;

    if (this.props.updateOptionId && this.props.updateOptionId !== prevProps.updateOptionId) {
      const [id, timestamp] = this.props.updateOptionId.split('-');
      if (this.props.value !== +id) {
        // 非当前id；
        return;
      }
      if (this.preTimestamp !== timestamp) {
        // 同id下，更新时间戳不一样；
        const originRef = this._ref && this._ref.getControlInstance();
        if (originRef) {
          originRef.fetchOptions();
        }
      }
      this.preTimestamp = timestamp;
    }
  }

  _hasFetchOption = false;

  getEduCourseOptions = async query => {
    this._hasFetchOption = true;
    const { name = null } = query || {};
    const { data = {}, value } = this.props;
    if (!data.classRelatedInfo) {
      return [];
    }
    let transferData = cloneDeep(data.classRelatedInfo.content);
    if (name) {
      transferData = transferData.filter(
        item =>
          item.eduClassName.includes(name) ||
          (isInStoreCondition({ supportEduHqStore: true }) &&
            item.shopName &&
            item.shopName.includes(name)),
      );
    }

    const options = transferData
      .map((item, index) => {
        return assign(
          {},
          {
            type: item.type,
            id: item.id,
            value: item.id,
            text:
              item.type === 0 || item.type === value ? (
                <div
                  className={`course-dropdown-classname ${
                    isInStoreCondition({
                      supportEduSingleStore: true,
                    })
                      ? 'course-canselect-option'
                      : ''
                  }`}
                >
                  {item.eduClassName}
                </div>
              ) : (
                ''
              ),
            extra:
              item.type === 0 || item.type === value ? (
                <>
                  {ShowWrapper({
                    children: <p className="course-dropdown-shopname">{item.shopName || ''}</p>,
                    isInStoreCondition: isInStoreCondition({
                      supportEduHqStore: true,
                    }),
                  })}
                </>
              ) : (
                <PopupTips
                  value={{
                    type: item.type,
                    kdtId: item.kdtId,
                    eduClassName: item.eduClassName,
                    id: item.id,
                    eduCourseId: data.id,
                    shopName: item.shopName,
                  }}
                />
              ),
          },
        );
      })
      .sort((preItem, nextItem) => {
        const pre = preItem.type > 3 ? 0 : preItem.type;
        const next = nextItem.type > 3 ? 0 : nextItem.type;
        return pre - next;
      });

    return new Promise((resolve, reject) => {
      resolve(options);
    });
  };

  getOptionByFilter = (optionItem, keyword) => {
    const { data } = this.props;
    const content = get(data, 'classRelatedInfo.content', []);
    return content.find(item => item.id === optionItem.value).eduClassName.indexOf(keyword) > -1;
  };

  onOptionSelect = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { value, disabled, data = {}, description } = this.props;
    const currentSelect = data.classRelatedInfo
      ? data.classRelatedInfo.content.find(item => item.id === value)
      : null;
    return (
      <>
        <ValuntaryAsyncSelect
          ref={ref => (this._ref = ref)}
          defaultOption={null}
          create={false}
          value={value}
          placeholder={currentSelect ? currentSelect.eduClassName : '请选择班级'}
          maxToShow={50}
          disabled={disabled}
          className="course-dropdown-selector"
          popupClassName="course-dropdown-popup"
          onSearch={keyword => {
            return { name: keyword };
          }}
          refresh={false}
          onChange={this.onOptionSelect}
          hideClose
          getOptions={this.getEduCourseOptions.bind(this)}
          infinityScroll={false}
          width="265px"
        />
        {<div className="course-dropdown__desc">{description}</div>}
      </>
    );
  }
}

export default getControlGroup(DropdownSelector);
