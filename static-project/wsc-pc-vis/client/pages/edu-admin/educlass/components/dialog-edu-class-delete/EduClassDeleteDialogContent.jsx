import React, { Component } from 'react';
import { Button, Notify } from 'zent';
import { deleteClass } from '../../api';

export default class EduClassDeleteDialogContent extends Component {
  state = {
    submitLoading: false,
  };

  deleteEduClass = () => {
    const { closeDialog, callback, defaultData = {} } = this.props;
    const { eduClass, kdtId } = defaultData;
    this.setState({ submitLoading: true });
    deleteClass({
      id: eduClass.id,
      kdtId: kdtId || _global.kdtId,
    })
      .then(() => {
        this.setState({ submitLoading: false });
        Notify.success('班级删除成功');
        callback();
        closeDialog();
      })
      .catch(error => {
        this.setState({ submitLoading: false });
        Notify.error(error);
      });
  };
  render() {
    const { submitLoading } = this.state;
    const { defaultData = {}, closeDialog } = this.props;
    const { eduClass } = defaultData;

    return (
      <div className="class-delete-dialog-content">
        <p className="class-delete-dialog-content__desc">
          删除“{eduClass.eduClassName}”后，后续的班级排课日程也将取消。
        </p>
        <p className="class-delete-dialog-content__desc">确认删除？</p>
        <div className="class-delete-dialog-content__actions">
          <Button type="primary" outline loading={submitLoading} onClick={this.deleteEduClass}>
            删除
          </Button>
          <Button type="primary" onClick={closeDialog}>
            我再想想
          </Button>
        </div>
      </div>
    );
  }
}
