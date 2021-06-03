import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { getDefaultText } from '../../../../utils/index';

export default class RemarkItem extends Component {
  render() {
    const { content } = this.props;
    const formatContent = getDefaultText(content);

    const contentLength = `${formatContent}`.length;

    const contentSplit = `${formatContent}`.slice(0, 6);

    const showText = contentLength > 6 ? `${contentSplit}...` : contentSplit;
    return (
      <React.Fragment>
        {
          (contentLength > 6)
            ? (<Pop className="reserve-pop-item" position="top-left" trigger="hover" content={content}>
              {showText}
            </Pop>) : <span>{showText}</span>
        }
      </React.Fragment>
    );
  }
}
