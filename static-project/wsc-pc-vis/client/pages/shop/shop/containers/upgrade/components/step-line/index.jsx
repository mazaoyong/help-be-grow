/**
 * 分割线
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export default class StepLine extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    rightLink: PropTypes.object,
  };

  render() {
    const { text, rightLink } = this.props;
    return (
      <div className="step-line">
        <span>{text}</span>
        {rightLink ? (
          <a href={rightLink.url} target="_Blank" rel="noopener noreferrer">
            {rightLink.title}
          </a>
        ) : null}
      </div>
    );
  }
}
