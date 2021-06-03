import React, { Component } from 'react';

import CustomizedForm from './CustomizedForm';

export default class VisForm extends Component<any, {}> {
  public static zentFormRef;

  public render() {
    return (
      <CustomizedForm ref={ref => (VisForm.zentFormRef = ref)} {...this.props}>
        {this.props.children}
      </CustomizedForm>
    );
  }
}
