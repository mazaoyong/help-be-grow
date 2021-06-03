import { Pop } from '@zent/compat';
import React from 'react';
import cx from 'classnames';
import { Icon } from 'zent';

import './style/add.scss';
import { IEditorCardAddProps } from './type';

const prefix = 'deco-editor-card-add';

export default class EditorCardAdd extends React.Component<IEditorCardAddProps> {
  render() {
    const { text, onAdd, selfDefinedText, filterClass, disable, disableText } = this.props;
    const className = cx(prefix, filterClass, {
      'deco-editor-card-add--disable': disable,
    });
    const content = (
      <div className={className} onClick={onAdd}>
        {selfDefinedText ? (
          text
        ) : (
          <>
            <Icon className={`${prefix}-icon`} type="plus" />
            {text && <span className={`${prefix}-text`}>{text}</span>}
          </>
        )}
      </div>
    );

    if (disable) {
      return (
        <Pop
          wrapperClassName="deco-editor-card-add-popover"
          trigger="hover"
          content={<div style={{ width: 224 }}>{disableText}</div>}
        >
          {content}
        </Pop>
      );
    }

    return content;
  }
}
