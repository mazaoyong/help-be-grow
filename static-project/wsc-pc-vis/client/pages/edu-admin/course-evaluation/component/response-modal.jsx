import React, { Component } from 'react';
import { Dialog, Input, Button, Notify } from 'zent';
import { putSellerEvaluation } from '../../api/course-evaluation';

export default class ResponseModal extends Component {
  state = {
    evaluation: '',
    loading: false,
  };

  renderFooter = () => {
    return (
      <div className="evalList__dialog-footer">
        <Button onClick={this.props.onClose}>取消</Button>
        <Button type="primary" loading={this.state.loading} onClick={this.submitResponse}>
          回复
        </Button>
      </div>
    );
  };

  // 提交评论
  submitResponse = () => {
    this.setState({ loading: true });
    const { evaluation } = this.state;
    if (evaluation.length < 5) {
      Notify.error('回复不少于5个字');
      this.setState({ loading: false });
      return void 0;
    }
    const { evaluationInfo, onClose } = this.props;
    if (evaluationInfo) {
      const { evaluationAlias, userId } = evaluationInfo;
      putSellerEvaluation({ evaluation, evaluationAlias, userId })
        .then(data => {
          if (data) {
            this.setState({ loading: false });
            Notify.success('回复成功');
          } else {
            Notify.error('回复失败');
          }
          onClose(!!data);
        })
        .catch(err => {
          this.setState({ loading: false });
          Notify.error(err);
          onClose();
        })
        .finally(_ => this.setState({ evaluation: '' }));
    } else {
      throw new Error('can not reply without target evaluation infomation');
    }
  };

  render() {
    const { visiable, evaluationInfo } = this.props;
    const { evaluation } = this.state;
    if (!evaluationInfo) return null;
    return (
      <Dialog
        mask
        closeBtn
        visible={visiable}
        className="evalList__dialog"
        title={`回复 ${evaluationInfo.nickName}`}
        onClose={this.props.onClose}
        footer={this.renderFooter()}
        style={{ width: '450px' }}
      >
        <label className="evalList__dialog-label">回复内容：</label>
        <Input
          type="textarea"
          value={evaluation}
          className="evalList__dialog-input"
          onChange={e => this.setState({ evaluation: e.target.value })}
          placeholder="用礼貌的回复给学生和家长留下一个美好的学习印象吧~（不可少于5个字）"
          maxLength={200}
          showCount
          autoSize
        />
      </Dialog>
    );
  }
}
