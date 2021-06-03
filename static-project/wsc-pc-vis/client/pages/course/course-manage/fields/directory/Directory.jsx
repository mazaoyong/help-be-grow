
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import DirectoryList from './components/DirectoryList';
import './index.scss';

const { Field } = Form;

export default class Directory extends Component {
  render() {
    const { label, directory } = this.props;
    return (
      <Field
        name="directory"
        className="directory-field"
        label={label}
        component={DirectoryList}
        value={directory}
        maxFirst={20}
        maxContent={20}
        asyncValidation={(_, value) =>
          new Promise((resolve, reject) => {
            if (value.directoryList.length === 0) {
              return resolve();
            }
            const result = value.directoryList.every(item => {
              let content = item.sectionList;
              if (item.title && content && content.length > 0) {
                return content.every(contentItem => contentItem.title);
              }
              return item.title;
            });
            if (result) {
              return resolve();
            }
            reject('请将课程大纲的信息填写完整');
          })
        }
      />
    );
  }
}
