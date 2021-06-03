
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { BlockLoading, Button } from 'zent';

const { createForm } = Form;

class MaxStudentDialogContent extends Component {
  onSubmit = values => {
    const { closeDialog, callback = () => { } } = this.props;
    callback();
    closeDialog();
  };

  render() {
    const { handleSubmit, closeDialog, defaultData = {} } = this.props;
    const max = defaultData.maxAppointNum || 0;

    return (
      <BlockLoading>
        <div className="max-student-dialog-content">
          <Form
            horizontal
            onSubmit={handleSubmit(this.onSubmit)}
            className="max-student-dialog-content__form"
          >
            <p className="max-student-dialog-content__desc">
              该上课日程已满员（上限{max}人），是否仍然预约？
            </p>
            <div className="max-student-dialog-content__actions">
              <Button type="primary" outline onClick={closeDialog}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定预约
              </Button>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const wrapped = createForm()(MaxStudentDialogContent);

export default wrapped;
