
import { Form } from '@zent/compat';
import React, { Component } from 'react';

const { FormInputField } = Form;

export default class DirectorySecondeItem extends Component {
  // 删除二级目录
  onContentDelete = contentId => {
    this.props.onContentDelete(contentId);
  };

  onUpdateContent = (evt, serialNo) => {
    let { content } = this.props;
    content.map(item => {
      if (item.serialNo === serialNo) {
        item.title = evt.target.value;
      }
    });
    this.props.onUpdateContent(content);
  };

  render() {
    let { content } = this.props;
    return (
      <div className="second-item">
        {content.map(item => {
          return (
            <div className="content" key={item.serialNo}>
              <FormInputField
                name="content"
                type="text"
                className="directory-input content-input"
                maxLength={20}
                required
                placeholder="上课内容，20字以内"
                value={item.title}
                onChange={evt => this.onUpdateContent(evt, item.serialNo)}
              />
              <p className="help-inline">
                <a href="javascript:;" onClick={() => this.onContentDelete(item.serialNo)}>
                  删除
                </a>
              </p>
            </div>
          );
        })}
      </div>
    );
  }
}
