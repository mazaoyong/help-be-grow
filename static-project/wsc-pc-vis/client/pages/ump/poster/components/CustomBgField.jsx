
import { Form } from '@zent/compat';
import React, { Component } from 'react';

import fullfillImage from 'zan-utils/fullfillImage';
import classnames from 'classnames';

import { customBgs } from '../constants';

const { getControlGroup } = Form;

class CustomBgWrapper extends Component {
  handleSelectBg = url => {
    if (!this.props.disabled) {
      this.props.onChange(url);
    }
  };

  getItmeClass(url) {
    return classnames({
      'bg-item': true,
      active: this.props.value === url,
    });
  }

  render() {
    return (
      <div className="bg-custom-wrapper">
        {customBgs.map(bg => {
          return (
            <div
              className={this.getItmeClass(bg.main)}
              key={bg.main}
              onClick={() => this.handleSelectBg(bg.main)}
            >
              <img src={fullfillImage(bg.little, '!60x60.png')} alt="" />
            </div>
          );
        })}
      </div>
    );
  }
}

export default getControlGroup(CustomBgWrapper);
