import React, { Component, Fragment } from 'react';
import { Input } from 'zent';

class Landline extends Component {
  render() {
    const { type, onChange } = this.props;

    return (
      <div className="zent-form__controls">
        {type === 1 ? (
          <Input onChange={onChange} />
        ) : (
          <Fragment>
            <Input placeholder="区号" onChange={onChange} /> -{' '}
            <Input placeholder="座机号码" onChange={onChange} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default Landline;
