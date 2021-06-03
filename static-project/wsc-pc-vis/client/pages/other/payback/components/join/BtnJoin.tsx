import React, { Component } from 'react';
import { Button, Checkbox } from 'zent';

interface Props {
  ServiceLink: string;
  applyLoading: boolean;
  handleApply: () => void;
}

interface State {
  checked: boolean;
}

class BtnJoin extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  public changeCheckbox = e => {
    this.setState({
      checked: e.target.checked,
    });
  };

  public render() {
    const { ServiceLink, handleApply, applyLoading } = this.props;
    const { checked } = this.state;
    return (
      <div className="join-btn-wrapper">
        <Button
          className="join-btn"
          type="primary"
          disabled={!checked}
          loading={applyLoading}
          onClick={handleApply}
        >
          申请开通
        </Button>
        <p className="agreement">
          <Checkbox checked={checked} onChange={this.changeCheckbox} />
          我已仔细阅读并同意
          <a href={ServiceLink} target="_blank" rel="noopener noreferrer">
            《课程快速回款服务协议》
          </a>
        </p>
      </div>
    );
  }
}

export default BtnJoin;
