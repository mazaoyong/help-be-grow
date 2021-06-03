
import { Select, Form } from '@zent/compat';
import React, { Component } from 'react';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class EduSelect extends Component {
  render() {
    const { extraComponent, async, ...rest } = this.props;
    const passableProps = omit(rest, unknownProps);

    return (
      <div className="edu-select-wrap">
        {async ? <ValuntaryAsyncSelect {...passableProps} /> : <Select {...passableProps} />}
        {!!extraComponent && extraComponent}
      </div>
    );
  }
}

const EduSelectField = getControlGroup(EduSelect);

export default EduSelectField;
