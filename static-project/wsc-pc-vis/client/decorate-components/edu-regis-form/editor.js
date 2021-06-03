import { Pop } from '@zent/compat';
import React from 'react';
import { Input, Radio, Checkbox, Notify, Icon } from 'zent';
import cx from 'classnames';
import _remove from 'lodash/remove';
import get from 'lodash/get';

import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, EditorCard, Divider, ChooseMenu } from '../common';

import { isEventLikeObject } from '../common/utils';

import ajax from 'fns/ajax';

import * as Types from './types.js';
import * as Helper from './helper';
import './index.scss';

const RadioGroup = Radio.Group;

/**
 * 布尔类型选项列表
 */
function generateBoolOptionList(index = 0) {
  const labelList = [
    ['是', '否'],
    ['需要', '不需要'],
  ];
  return [
    {
      label: labelList[index][0],
      value: true,
    },
    {
      label: labelList[index][1],
      value: false,
    },
  ];
}

/**
 * 区分标准资料项中不可删除的资料项
 */
function splitDataItemList(list) {
  const _default = [];
  const _standard = [];
  list.forEach(item => {
    item.canDel ? _standard.push(item) : _default.push(item);
  });
  return [_default, _standard];
}

/**
 * @name pc端报名表单组件编辑器
 * @description 对报名表单组件进行标题、资料项的配置
 * @author yanglifeng
 * @extends DesignEditor 微页面编辑组件实现参考<https://youzan.github.io/zent/zh/component/design>
 */
export default class EduRegisFormEditor extends DesignEditor {
  /**
   * 基本信息
   */
  static info = {
    type: Types.key,
    name: '报名表单',
    description: '报名表单',
    icon: 'https://img.yzcdn.cn/public_files/2019/07/02/330d50e2554d941f5e4f7bbb890487cf.png',
    maxNum: 1,
    usedNum: 0,
    status: '',
  };

  /**
   * 添加组件时默认调用，用来获取新组件的初始值
   * 把整个组件封装为一个对象，方便操作
   * @param {*} settings
   * @param {*} globalConfig
   */
  // eslint-disable-next-line no-unused-vars
  static getInitialValue(settings, globalConfig) {
    return {
      type: Types.key,
      editorState: {
        // isYZEdu: get(_global, 'isYZEdu', false),
        submitText: '立即报名',
        list: [], // 展示资料项列表
        urlType: 'result',
        customUrl: {},
      },
    };
  }

  /**
   * 组件校验
   * @param {*} value
   */
  static validate(value, prevValue, changedProps) {
    return new Promise(resolve => {
      const errors = {};
      const { submitText = '', urlType = '', customUrl = {} } = value.editorState;
      if (!changedProps.length && urlType === 'custom' && !customUrl.link_url) {
        errors.customUrl = '请选择提交后跳转的页面';
      }
      if (!submitText.match(/^.{1,10}$/)) {
        errors.title = '请重新输入按钮文字，1～10个字，必填';
      }
      resolve(errors);
    });
  }

  componentDidMount() {
    this.fetchDataItemList();
  }

  state = {
    allList: [],
    supportSomeProfile: false,
  };

  /**
   * 渲染模板
   */
  render() {
    const { showError, validation, globalConfig, settings, linkMenuItems } = this.props;
    const { editorState = {} } = this.props.value;
    const { submitText, list = [], urlType = 'result', customUrl = {} } = editorState;

    /**
     * 渲染radio选项
     * @param {String} name
     * @param {Array} list
     */
    // eslint-disable-next-line no-shadow
    const renderRadioList = (name, list) =>
      list.map(item => {
        return (
          <Radio name={item.label} key={item.label} value={item.value}>
            {item.label}
          </Radio>
        );
      });

    return (
      <div className={`rc-design-component-${Types.key}-editor`}>
        <ComponentTitle name={Types.label} noticeMsg={Types.tipsMsg} url={Types.titleUrl} />
        <ControlGroup
          label="按钮文字"
          labelColored
          required
          block
          showError={showError}
          error={validation.title}
          className="first-group"
        >
          <Input
            name="submitText"
            maxLength={10}
            value={submitText}
            onChange={this.onChangeVal}
            onBlur={this.onChangeVal}
          />
        </ControlGroup>

        <ControlGroup
          label="提交后跳转"
          showError={showError}
          error={validation.customUrl}
          labelColored
          required
          className="custom-url__type-chooser"
        >
          <RadioGroup value={urlType} onChange={this.onUrlTypeChange}>
            <Radio key="result" name="result" value="result">
              提交成功页面
              <Pop
                trigger="hover"
                centerArrow
                content={
                  <div className="custom-url__pop-content">
                    <img src="https://img.yzcdn.cn/cdn/paidstatus.png" />
                  </div>
                }
                position="bottom-right"
              >
                <span>
                  &nbsp; <Icon type="help-circle" />
                </span>
              </Pop>
            </Radio>
            <Radio key="custom" name="custom" value="custom">
              自定义页面
            </Radio>
          </RadioGroup>
        </ControlGroup>

        {urlType === 'custom' ? (
          <div className="custom-url__url-chooser">
            <div className="custom-url__url-chooser__container">
              <span>跳转页面</span>
              <ChooseMenu
                globalConfig={globalConfig}
                settings={settings}
                value={customUrl}
                onChange={this.onCustomUrlChange}
                linkMenuItems={linkMenuItems}
              />
            </div>
          </div>
        ) : null}

        <Divider />

        <div className="field-wrap">
          {this.state.allList
            .sort((a, b) => (a.canDel ? 1 : a.itemId < b.itemId ? -1 : 0))
            .map(item => (
              <ControlGroup
                label={item.itemName}
                key={item.itemId}
                value={Helper.getCheckBoxValue(list, item)}
              >
                <Checkbox
                  checked={Helper.getCheckBoxState(list, item)}
                  disabled={!item.canDel}
                  onChange={this.onChangeCurrentList(list, item)}
                />
              </ControlGroup>
            ))}
        </div>
        <div className="field-wrap hint">
          没有想要的资料项？
          <a target="__blank" href={`${_global.url.v4}/vis/edu/settings/student-profile#/list`}>
            去添加
          </a>
          <a onClick={this.fetchDataItemList}>刷新</a>
        </div>
        {!this.state.supportSomeProfile && (
          <div className="field-wrap hint">
            <Icon type="info-circle-o" style={{ color: '#666', marginRight: '8px' }} />
            当前小程序版本暂不支持数据类型为“多选项”和“省市区”的自定义资料项，请升级小程序到2.42及以上版本
          </div>
        )}
        <ControlGroup
          className={`rc-design-component-${Types.key}-editor__list`}
          showLabel={false}
          bgColored
        >
          <EditorCard
            canDelete={index => list[index].canDel}
            list={list}
            canAdd={false}
            onChange={val => this.onChangeCustomVal('list')(val)}
          >
            {list.map(item => {
              const {
                itemName,
                itemType,
                itemTags,
                itemValueList = [],
                canDel,
                feItemCustomName,
                feNeedCaptcha,
                feRequired,
              } = item;
              return (
                <div
                  className={cx([
                    `${Types.key}__field`,
                    {
                      [`${Types.key}__field--canDel`]: !canDel,
                    },
                  ])}
                  key={item.itemId}
                >
                  <div className={`${Types.key}__hd`}>
                    <i className={`${Types.key}__icon-drag`} />
                    <div className={`${Types.key}__hd-name`}>{itemName}</div>
                  </div>
                  <div className={`${Types.key}__bd`}>
                    <ControlGroup label="项目名：" className={cx(`${Types.key}__dataItemLabel`)}>
                      <Input
                        maxLength={7}
                        value={feItemCustomName}
                        placeholder="最多输入7个字"
                        onChange={e => this.onChangeListItem(item.itemId, 'feItemCustomName', e)}
                        onBlur={e => this.onChangeListItem(item.itemId, 'feItemCustomName', e)}
                      />
                    </ControlGroup>
                    {!itemTags.some(tag => tag === 'edu_stuName') &&
                      !itemTags.some(tag => tag === 'edu_stuContractPhone') && (
                        <ControlGroup label="是否必填：">
                          <RadioGroup
                            value={feRequired}
                            onChange={e => this.onChangeListItem(item.itemId, 'feRequired', e)}
                          >
                            {renderRadioList('feRequired', generateBoolOptionList())}
                          </RadioGroup>
                        </ControlGroup>
                      )}
                    {itemType === 9 && (
                      <ControlGroup
                        label="验证码："
                        className={cx({
                          [`${Types.key}__captcha`]: feNeedCaptcha,
                        })}
                      >
                        <RadioGroup
                          value={feNeedCaptcha}
                          onChange={e => this.onChangeListItem(item.itemId, 'feNeedCaptcha', e)}
                        >
                          {renderRadioList('feNeedCaptcha', generateBoolOptionList(1))}
                        </RadioGroup>
                        {feNeedCaptcha && (
                          <div className={cx(`${Types.key}__captchaTip`)}>
                            发送短信的费用，将从你的短信额度中扣除
                            <br />
                            <a
                              href="https://www.youzan.com/v4/message/messagepush#/messagegroup"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              查看剩余短信数量
                            </a>
                          </div>
                        )}
                      </ControlGroup>
                    )}
                    {(itemType === 4 || itemType === 7 || itemType === 8) && (
                      <ControlGroup label="选项内容：" labelAlign="top">
                        <div>{itemValueList.join('、')}</div>
                      </ControlGroup>
                    )}
                  </div>
                </div>
              );
            })}
          </EditorCard>
        </ControlGroup>
      </div>
    );
  }

  /**
   * 修改当前表单资料项
   */
  onChangeCurrentList = (list, item) => e => {
    const value = e.target.checked;
    if (value) {
      list.push(item);
    } else {
      _remove(list, it => it.itemId === item.itemId);
    }
    this.onChangeCustomVal('list')(list);
  };

  /**
   * 通用表单元素onChange回调
   */
  onChangeVal = e => {
    if (!isEventLikeObject(e)) {
      throw new Error(Types.notEventMsg);
    }

    const { onChange } = this.props;
    const { target } = e;
    const { name, type } = target;
    let { value } = target;

    if (type === 'checkbox') {
      value = target.checked;
    }

    onChange({
      editorState: {
        ...this.props.value.editorState,
        [name]: value,
      },
    });
  };

  /**
   * 自定义单值修改
   */
  onChangeCustomVal = name => value => {
    const { onChange } = this.props;
    onChange({
      editorState: {
        ...this.props.value.editorState,
        [name]: value,
      },
    });
  };

  /**
   * 修改list里的值
   */
  onChangeListItem = (targetId, key, e) => {
    const { editorState = {} } = this.props.value;
    const { list = [] } = editorState;
    const { target = {} } = e;
    const { value } = target;

    const _list = list.map(item => {
      const _item = item;
      if (item.itemId === targetId) {
        _item[key] = value;
      }
      return _item;
    });

    this.onChangeCustomVal('list')(_list);
  };

  /**
   * 自定义链接类型改变事件
   */
  onUrlTypeChange = e => {
    const { onChange } = this.props;
    onChange({
      editorState: {
        ...this.props.value.editorState,
        urlType: e.target.value,
      },
    });
  };

  /**
   * 选择自定义链接
   */
  onCustomUrlChange = newUrl => {
    const { onChange } = this.props;
    onChange({
      editorState: {
        ...this.props.value.editorState,
        customUrl: newUrl,
      },
    });
  };

  /**
   * 接口数据交互
   * 获取资料项列表
   */
  getProfileList = (editorState, oldParamsType = false) => {
    const fetchMethodConf = {
      url: `${_global.url.base}/v4/vis/edu/regis/record/findDataItems.json`,
      data: {
        excludeByAttribueKey: ['edu_idCard'],
      },
    };
    if (oldParamsType) {
      delete fetchMethodConf.data;
    }
    return ajax(fetchMethodConf)
      .then(data => {
        const { list: currentList = [] } = editorState;
        const _tempList = [];
        const _data = data.map(item => ({
          ...item,
          feRequired: true, // 是否必填
          feNeedCaptcha: false, // 是否需要短信验证码
          feItemCustomName: item.itemName, // 用户自定义资料项名称
        }));
        const [
          _defaultDataItemList, // 必选资料项，默认不可删除
        ] = splitDataItemList(_data);

        _defaultDataItemList.forEach(item => {
          const { itemId } = item;
          if (!currentList.find(x => itemId === x.itemId)) {
            _tempList.push(item);
          }
        });

        this.setState({
          allList: _data,
        });
        this.onChangeCustomVal('list')([...currentList, ..._tempList]); // 已选的学员资料项
      })
      .catch(err => {
        Notify.error(err);
      });
  };
  fetchDataItemList = () => {
    const { editorState = {} } = this.props.value;
    // 🚨/v4/vis/channel/getMpVersion.json这个接口在pc-vis中
    return ajax({
      url: `${_global.url.base}/v4/vis/channel/getMpVersion.json`,
      data: { accountType: 2 },
    })
      .then(data => {
        // 如果没有小程序版本，说明没有小程序支持，就走h5，h5支持新接口
        // 如果没有拿到发布版本号，就用2.42来代替
        const microProgramVersion = get(data, 'releaseVersion') || '2.42';
        // 会拿到2.31.4这样的版本号，然后拿到大版本和小版本之后跟2.42版本进行比较
        let majorVersion = String(microProgramVersion).match(/^(\d+\.\d+)(\.\d+)?/);
        if (majorVersion) {
          // 比较231和242版本
          majorVersion = majorVersion[1].replace('.', '');
          this.setState({
            supportSomeProfile: majorVersion >= 242,
          });
          if (majorVersion >= 242) {
            return this.getProfileList(editorState);
          } else {
            // 调用老接口
            return this.getProfileList(editorState, true);
          }
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  };
}
