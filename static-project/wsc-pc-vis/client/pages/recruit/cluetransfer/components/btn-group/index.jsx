import React, { PureComponent } from 'react';
import { Button, Dialog } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import './styles.scss';

const { closeDialog } = Dialog;

const dialogId = 'add-dialog';

export default class BtnGroup extends PureComponent {
  handleCancel = () => {
    closeDialog(dialogId);
  };
  render() {
    const { loading } = this.props;
    return (
      <div className="clue_btn-group">
        <Button type="primary" outline onClick={this.handleCancel}>取消</Button>
        <SamButton loading={loading} htmlType="submit" type="primary">
          保存
        </SamButton>
      </div>
    );
  }
}
