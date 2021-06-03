import React, { Component } from 'react';

export default class ContactUsDesignPreviewItem extends Component {
  render() {
    const { children, prefix } = this.props;

    return (
      <div className={`${prefix}-design-preview-item contact-us-design-preview-item`}>
        {children}
      </div>
    );
  }

  scrollTop() {
    /* Do nothing */
  }
}
