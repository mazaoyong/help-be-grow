import React from 'react';
import { Button, ColorPicker } from 'zent';

import './style/index.scss';

const prefix = 'deco-color-picker';

export default class extends React.Component {
  // 重置颜色
  reset = () => {
    const { defaultColor, onChange } = this.props;
    onChange && onChange(defaultColor);
  };

  render() {
    const { defaultColor, color, ...restProps } = this.props;

    return (
      <div className={prefix}>
        {defaultColor && (
          <Button
            className={`${prefix}__reset`}
            type="primary"
            outline
            bordered={false}
            onClick={this.reset}
          >
            <span>重置</span>
          </Button>
        )}
        <ColorPicker
          {...restProps}
          color={color || defaultColor}
          wrapperClassName={`${prefix}__picker`}
        />
      </div>
    );
  }
}
