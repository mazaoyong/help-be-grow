
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Tag } from 'zent';
import chooseLiveQrcode from '@youzan/react-components/es/components/choose-dialog/dialogs/live-qrcode';
import { getActivityCode } from '../../../api/edu';
import '@youzan/react-components/es/components/choose-dialog/style';
import { get } from 'lodash';

const { getControlGroup } = Form;

const formatOutput = item => {
  if (!item) {
    return {};
  }
  const { output } = mapper;
  return Object.keys(output).reduce((obj, key) => {
    return Object.assign(obj, { [output[key]]: item[key] });
  }, {});
};

const mapper = {
  output: {
    name: 'codeName',
    id: 'codeId',
    url: 'codePicture',
    sourceKdtId: 'codeKdtId',
  },
  input: {
    codeName: 'name',
    codeId: 'id',
    codePicture: 'url',
    codeKdtId: 'sourceKdtId',
  },
};

class LiveCodeSelectWrap extends PureComponent {
  componentDidMount() {
    this.formatAndUpdate(this.props.value);
  }

  handleLiveQrCodeChoose = () => {
    chooseLiveQrcode({
      multiple: false,
      onChoose: data => {
        const formattedData = formatOutput(data && data[0]);
        this.props.onChange(formattedData);
      },
      config: window._global,
    });
  };

  render() {
    const { value } = this.props;
    if (value && value.codeName) {
      return (
        <Tag
          theme="grey"
          outline
          className="signin-code-select_item"
          closable
          onClose={this.handleLiveQrCodeRemove}
        >
          {value.codeName}
        </Tag>
      );
    }
    return (
      <a className="signin-code-select_button" onClick={this.handleLiveQrCodeChoose}>
        选择活码
      </a>
    );
  }

  formatAndUpdate = value => {
    if (value && value.codeId && !value.codeName) {
      getActivityCode({ activityId: value.codeId, sourceKdtId: get(_global, 'shopInfo.rootKdtId') || _global.kdtId }).then(codeName => {
        this.props.onChange({
          codeId: value.codeId,
          codeName,
        });
      });
    }
  };

  handleLiveQrCodeRemove = () => {
    this.props.onChange({});
  };
}

export default getControlGroup(LiveCodeSelectWrap);
