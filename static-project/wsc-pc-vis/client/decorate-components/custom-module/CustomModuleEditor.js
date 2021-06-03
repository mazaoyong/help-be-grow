import React from 'react';
import get from 'lodash/get';
import LinkTag from '../common/link-tag';
import chooseComponent from '@youzan/react-components/es/components/choose-dialog/dialogs/component';
import { Button } from 'zent';
import ControlGroup from '../common/control-group';
import { DesignEditor } from '../editor-base/design-editor';
import ComponentTitle from '../common/component-title';
import '@youzan/react-components/es/components/choose-dialog/style';

const prefix = 'decorate-custom-module-editor';

export default class CustomModuleEditor extends DesignEditor {
  chooseComponent = () => {
    const { globalConfig } = this.props;

    chooseComponent({
      config: globalConfig,
      onChoose: sel => {
        const data = {
          _id: get(sel, '[0]id', ''),
          title: get(sel, '[0]title', ''),
          link: get(sel, '[0]url', ''),
        };

        this.props.onChange(data);
      },
    });
  };

  closeHandler = () => {
    const data = {
      _id: '',
      title: '',
      link: '',
    };
    this.props.onChange(data);
  };

  render() {
    const { value, showError, validation } = this.props;
    const { _id, title, link } = value;

    return (
      <div className={prefix}>
        <ComponentTitle name="自定义模块" />

        <ControlGroup
          className={`${prefix}__control-group`}
          label="自定义页面模块: "
          block={!!link}
          normalAlign
          showError={showError || this.getMetaProperty('_id', 'touched')}
          error={validation.id}
        >
          {link ? (
            <LinkTag
              url={link}
              onEdit={this.chooseComponent}
              colored
              onClose={this.closeHandler.bind(this)}
            >
              {_id ? title : ''}
            </LinkTag>
          ) : (
            <Button
              type="primary"
              outline
              onClick={this.chooseComponent}
              className={`${prefix}__add-btn`}
            >
              添加
            </Button>
          )}
        </ControlGroup>
      </div>
    );
  }

  // 组件信息
  static info = {
    type: 'component',
    name: '自定义模块',
    description: '自定义模块',
    icon: ' https://img.yzcdn.cn/public_files/2019/02/12/4cad696dae9ec0ed73ce9c327ad026c0.png',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'component',
      link: '',
      title: '点击编辑 “自定义页面模块”',
      _id: '',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { _id } = value;

      if (!_id) {
        errors.id = '请选择一个自定义页面模块。';
      }

      resolve(errors);
    });
  }
}
