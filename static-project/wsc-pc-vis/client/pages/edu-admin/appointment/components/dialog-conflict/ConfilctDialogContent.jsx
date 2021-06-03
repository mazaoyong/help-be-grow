
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { BlockLoading, Button } from 'zent';

const { createForm } = Form;

class ConflictDialogContent extends Component {
  onSubmit = () => {
    const { callback, closeDialog } = this.props;
    callback();
    closeDialog();
  }

  render() {
    const { handleSubmit, defaultData = {}, closeDialog } = this.props;
    const type = defaultData.type || 0; // 0 添加 1 修改
    const textMap = {
      '0': '添加',
      '1': '修改',
    };
    return (
      <BlockLoading>
        <div className="conflict-dialog-content">
          <Form
            horizontal
            onSubmit={handleSubmit(this.onSubmit)}
            className="conflict-dialog-content__form"
          >
            <p className="conflict-dialog-content__desc">
              {`${defaultData.conflictMsg}，是否继续${textMap[type]}？`}
            </p>
            <div className="conflict-dialog-content__actions">
              <Button type="primary" outline htmlType="submit">
                确定{textMap[type]}
              </Button>
              <Button type="primary" onClick={closeDialog}>
                我再想想
              </Button>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const wrapped = createForm()(ConflictDialogContent);

export default wrapped;
