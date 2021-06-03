
import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import { Notify } from 'zent';
import Design from '@zent/design';
import assign from 'lodash/assign';

import getTypeWithoutWeapp from 'components/design/common/get-wechat-type';
import ConfigEditor from 'components/design/config/ConfigEditor';
import richtextConf from 'components/design/richtext';
import { UEDITOR_TOOLBARS_S } from 'constants/ueditor-toolbars';
import audioConf from './audio';

// 样式
import 'components/design/assets/common/index.scss';
// 组件样式
import 'components/design/richtext/style/index.scss';
import './audio/style/index.scss';

import PunchConfigPreview from './PunchConfigPreview';

import getFirstDesignError from 'fns/get-first-fesign-error';

const { getControlGroup } = Form;

window._global.mp_data = window._global.shopInfo;

const uploadConfig = {
  maxSize: 3 * 1024 * 1024,
  fetchUrl: `${_global.url.v4}/api/iron/materials/shopPubImg.json`,
  tokenUrl: `${_global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`,
};

const audioUploadConfig = {
  accept: 'audio/mpeg, audio/AMR',
  fetchUrl: `${_global.url.www}/ump/paidcontent/fetchPubImg.json`,
  tokenUrl: `${_global.url.v4}/api/iron/materials/audioUploadToken.json`,
};

const components = [
  {
    type: ConfigEditor.designType,
    preview: PunchConfigPreview,
    editor: ConfigEditor,
    dragable: false,
    appendable: false,
    editable: false,
    configurable: false,
    highlightWhenSelect: false,
  },

  Design.group('基础组件'),
  // 富文本
  assign({}, richtextConf, {
    editorProps: {
      richTextConfig: {
        uploadConfig,
        editorConfig: {
          initialFrameWidth: 386,
          initialFrameHeight: 340,
          autoClearinitialContent: false,
          autoFloatEnabled: true,
          wordCount: false,
          elementPathEnabled: false,
          pasteplain: false,
          toolbars: UEDITOR_TOOLBARS_S,
        },
      },
    },
    defaultType: getTypeWithoutWeapp,
  }),
  // 语音
  assign({}, audioConf, {
    editorProps: {
      uploadConfig,
      audioUploadConfig,
    },
    defaultType: getTypeWithoutWeapp,
  }),
];

class PunchDetailEditor extends (PureComponent || Component) {
  state = {
    unloadLoading: false,
    previewLoading: false,
  };

  validate = fn => () => {
    this.design
      .validate()
      .then(fn)
      .catch(err => {
        const errContent = getFirstDesignError(err);
        if (errContent) {
          Notify.error(errContent);
        }
      });
  };

  onChange = data => {
    this.props.onChange(data);
  };

  saveDesign = instance => {
    this.design = instance;
  };

  render() {
    let { value } = this.props;

    return (
      <div className="punch-design">
        <Design
          ref={instance => {
            this.design = instance;
          }}
          cacheId="zent-punch-edit"
          defaultSelectedIndex={-1}
          confirmUnsavedLeave={false}
          components={components}
          value={value}
          onChange={this.onChange}
          globalConfig={window._global}
        />
      </div>
    );
  }
}

export default getControlGroup(PunchDetailEditor);
