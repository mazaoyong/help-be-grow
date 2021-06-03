import React, { PureComponent } from 'react';
import { Button } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import './styles.scss';
import { hashHistory } from 'react-router';

export default class BtnGroup extends PureComponent {
  handleCancel = () => {
    // TODO if there is no history, redirect to another page
    hashHistory.goBack();
  };
  render() {
    const { loading } = this.props;
    return (
      <div className="certificate_btn-group">
        <Button outline onClick={this.handleCancel}>取消</Button>
        <SamButton loading={loading} htmlType="submit" type="primary">
          保存
        </SamButton>
      </div>
    );
  }
}
