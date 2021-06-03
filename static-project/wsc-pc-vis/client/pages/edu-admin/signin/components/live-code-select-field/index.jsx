import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Icon } from 'zent';
import chooseLiveQrcode from '@youzan/react-components/es/components/choose-dialog/dialogs/live-qrcode';
import '@youzan/react-components/es/components/choose-dialog/style';
import { getActivityCode } from '../../domain/apis/edit';

const { getControlGroup } = Form;

class LiveCodeSelectWrap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }

  componentWillMount() {
    const newValue = this.formatInput(this.props.value);
    this.formatAndUpdate(newValue);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      const newValue = this.formatInput(nextProps.value);
      this.formatAndUpdate(newValue);
    }
  }

  render() {
    const { value } = this.state;
    if (value && value.name) {
      return (
        <span className="signin-code-select_item">
          {value.name}
          <Icon type="close" onClick={this.handleLiveQrCodeRemove} />
        </span>
      );
    }
    return (
      <a
        className="signin-code-select_button"
        href="javascript: void(0);"
        onClick={this.handleLiveQrCodeChoose}
      >
        选择活码
      </a>
    );
  }

  formatAndUpdate = ({ id, name, sourceKdtId }) => {
    if (id) {
      if (!name) {
        getActivityCode({ activityId: id, sourceKdtId }).then((data) => {
          this.setState({ value: { id, name: data, sourceKdtId } });
        });
      } else {
        this.setState({ value: { id, name, sourceKdtId } });
      }
    } else {
      this.setState({ value: {} });
    }
  };

  handleLiveQrCodeChoose = () => {
    chooseLiveQrcode({
      multiple: false,
      onChoose: (data) => {
        const formattedData = this.formatOutput(data && data[0]);
        this.props.onChange(formattedData);
      },
      config: window._global,
    });
  };

  handleLiveQrCodeRemove = () => {
    this.props.onChange({});
  };

  formatOutput = (item) => {
    if (!item) {
      return {};
    }
    const { output } = this.mapper;
    return Object.keys(output).reduce((obj, key) => {
      return Object.assign(obj, { [output[key]]: item[key] });
    }, {});
  };

  formatInput = (item) => {
    if (!item) {
      return {};
    }
    const { input } = this.mapper;
    return Object.keys(input).reduce((obj, key) => {
      return Object.assign(obj, { [input[key]]: item[key] });
    }, {});
  };

  mapper = {
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
}

export default getControlGroup(LiveCodeSelectWrap);
