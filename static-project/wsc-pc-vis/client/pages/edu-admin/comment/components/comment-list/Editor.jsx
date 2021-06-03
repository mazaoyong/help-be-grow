import React, { Component } from 'react';
import { Input, Notify } from 'zent';

export default class Editor extends Component {
  state = {
    text: '',
  };

  handleChange = e => {
    this.setState({
      text: e.target.value,
    });
  };

  validateComment = () => {
    const text = this.state.text;
    if (text.replace(/\s+/g, '') === '') {
      Notify.error('回复内容不能为空');
      return;
    }
    this.props.addComment(this.state.text);
  };

  render() {
    const text = this.state.text;
    return (
      <div className="comment-content-editor">
        <Input
          type="textarea"
          placeholder="回复该留言"
          value={text}
          onChange={this.handleChange}
          maxLength={800}
          showCount
          autoSize
          autoFocus
        />
        <div className="comment-content-editor__action">
          <span className="comment-content-editor__action__ok" onClick={this.validateComment}>
            发布
          </span>
          <span className="comment-content-editor__action__cancel" onClick={this.props.cancel}>
            取消
          </span>
        </div>
      </div>
    );
  }
}
