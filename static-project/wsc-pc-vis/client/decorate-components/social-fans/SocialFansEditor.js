import React from 'react';
import { DesignEditor } from '@zent/design/es/editor/DesignEditor';
import isEmpty from 'lodash/isEmpty';
import { ComponentTitle, Tabs } from '../common';
import { GroupPanel } from './components/group-panel';
import { OfficialPanel } from './components/official-panel';
import { openTutorialDialog } from './components/tutorial-dialog';
import {
  SUB_TYPE,
  LOGO_TYPE,
  DEFAULT_BACKGROUND,
  DEFAULT_LOGO,
  OLD_COMPONENT_TYPE,
} from './constants';

const prefix = 'decorate-official-account-editor';

export default class OfficialAccountEditor extends DesignEditor {
  componentWillMount() {
    const { value } = this.props;
    const { type } = value;

    if (type === OLD_COMPONENT_TYPE) {
      Object.assign(this.props.value, {
        isWeappSupport: true,
        subType: SUB_TYPE.official,
      });
    }
  }

  handleSubTypeChange = subType => {
    this.props.onChange({ subType });
  };

  openTutorialDialog = () => {
    openTutorialDialog();
  };

  render() {
    const { value, showError, validation, globalConfig, onChange, uploadConfig } = this.props;
    const {
      // 由于之前只有公众号，所以如果subType没有，就默认给他公众号的类型
      subType = SUB_TYPE.official,
    } = value;

    return (
      <div className={`${prefix}`}>
        <ComponentTitle
          withMargin
          name="社群涨粉"
          url="https://help.youzan.com/displaylist/detail_4_4-2-29816"
          noticeMsg={
            <p>
              若在小程序内扫码，需接入客服消息并按照提示操作查看小程序内
              <span className="deco-component-title__link" onClick={this.openTutorialDialog}>
                操作流程
              </span>
              ，小程序 v2.31 及以上版本支持
            </p>
          }
        />

        <Tabs activeId={subType} onChange={this.handleSubTypeChange}>
          <Tabs.TabPanel id="1" tab="加微信群/个人微信号">
            <GroupPanel
              value={value}
              showError={showError}
              validation={validation}
              globalConfig={globalConfig}
              onChange={onChange}
              uploadConfig={uploadConfig}
              onInputChange={this.onInputChange}
              onCustomInputChange={this.onCustomInputChange}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2" tab="关注公众号">
            <OfficialPanel
              value={value}
              showError={showError}
              validation={validation}
              globalConfig={globalConfig}
              onChange={onChange}
              uploadConfig={uploadConfig}
            />
          </Tabs.TabPanel>
        </Tabs>
      </div>
    );
  }

  // 组件的类型
  static designType = 'social_fans';

  // 组件的描述
  static designDescription = <span>关注公众号</span>;

  static info = {
    type: ['social_fans', OLD_COMPONENT_TYPE],
    name: '社群涨粉',
    description: '社群涨粉',
    icon: 'https://img.yzcdn.cn/public_files/2019/05/21/23479b6003710298172fe0d92a7e5deb.png',
    maxNum: 1,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'social_fans',
      subType: SUB_TYPE.group, // 订阅类型 1: 群/个人号 2. 公众号
      qrcodeUrl: '',
      btnName: '',
      logoType: LOGO_TYPE.default,
      logo: DEFAULT_LOGO,
      customLogo: DEFAULT_LOGO,
      scene: '', // 活码类型 'WeiXin' || 'WeiXinGroup'
      title: '',
      desc: '',
      bgUrl: '',
      bgColor: DEFAULT_BACKGROUND,
      isWeappSupport: '1',
      isWeappContactSupport: '1',
      isH5Support: '1',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const {
        qrcodeUrl,
        btnName = '',
        title,
        desc,
        logoType,
        customLogo,
        subType,
        isWeappSupport,
        isWeappContactSupport,
        isH5Support,
      } = value;

      if (subType === SUB_TYPE.group) {
        if (isEmpty(qrcodeUrl)) {
          errors.qrcodeUrl = '请选择活码';
        }

        if (isEmpty(btnName)) {
          errors.btnName = '请填写按钮名称';
        } else if (btnName.length > 4) {
          errors.btnName = '按钮名称不能超过4个汉字';
        }

        if (isEmpty(title)) {
          errors.title = '请填写标题';
        } else if (title.length > 10) {
          errors.title = '标题不能超过10个汉字';
        }

        if (isEmpty(desc)) {
          errors.desc = '请填写描述';
        } else if (desc.length > 15) {
          errors.desc = '描述不能超过15个汉字';
        }

        if (logoType === LOGO_TYPE.custom && isEmpty(customLogo)) {
          errors.logo = '请选择入口图片';
        }
      }

      if (subType === SUB_TYPE.official) {
        if (isWeappSupport === '0' && isWeappContactSupport === '0' && isH5Support === '0') {
          errors.support = '至少选择一项关注方式';
        }
      }

      resolve(errors);
    });
  }
}
