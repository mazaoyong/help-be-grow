import React, { PureComponent } from 'react';
import { Button as SamButton } from '@youzan/sam-components';

import './styles.scss';

export default class BtnGroup extends PureComponent<{ loading: boolean }> {
  render() {
    const { loading } = this.props;
    return (
      <div className="signin_btn-group">
        <SamButton loading={loading} htmlType="submit" type="primary">
          保存
        </SamButton>
      </div>
    );
  }
}
