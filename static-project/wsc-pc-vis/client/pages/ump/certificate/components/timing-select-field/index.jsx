import React, { PureComponent } from 'react';
import { NumberInput } from 'zent';
import './styles.scss';

import getControlGroup from '../../../../../components/form/get-control-group';

class TimingSelectField extends PureComponent {
  render() {
    const { issueType, issueLimit, disabled } = this.props;
    const { beforeDays, issuePercentage } = this.props.value || {};
    switch (issueType) {
      case 0:
        return (
          <>
            <div className="certificate-timing-0">线下课有效期截止日发放</div>
            <div className="certificate-timing-desc">适用于按自定义售卖的线下课，需要商家手动设置线下课有效期</div>
          </>
        );
      case 1:
        return (
          <>
            <div className="certificate-timing-input-wrapper">
              消课率达到
              <div className="certificate-timing-input">
                <NumberInput
                  min={0}
                  width={100}
                  disabled={disabled}
                  value={issuePercentage}
                  onChange={this.handleChange('issuePercentage')}
                  showStepper />
              </div>
              % 发放毕业证书
            </div>
            <div className="certificate-timing-desc">
              消课率=已上课次数/需要上课总次数，适用于按课时售卖的线下课，填写范围：
              <br />
              80% - 100%
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="certificate-timing-input-wrapper">
              到有效期前
              <div className="certificate-timing-input">
                <NumberInput
                  min={0}
                  width={100}
                  disabled={disabled}
                  value={beforeDays}
                  onChange={this.handleChange('beforeDays')}
                  showStepper />
              </div>
              天发放毕业证书
            </div>
            <div className="certificate-timing-desc">适用于按时段售卖的线下课，填写范围 0-{issueLimit} 天</div>
          </>
        );
      case 3:
        return (
          <>
            <div className="certificate-timing-input-wrapper">
              到达结班时间前
              <div className="certificate-timing-input">
                <NumberInput
                  min={0}
                  width={100}
                  disabled={disabled}
                  value={beforeDays}
                  onChange={this.handleChange('beforeDays')}
                  showStepper />
              </div>
              天发放毕业证书
            </div>
            <div className="certificate-timing-desc">适用于按期售卖的线下课，填写范围 0-{issueLimit} 天</div>
          </>
        );
      default:
        return null;
    }
  }
  handleChange = name => val => {
    const { value, onChange } = this.props;
    const newValue = Object.assign({}, value, { [name]: val });
    onChange(newValue);
  }
}

export default getControlGroup(TimingSelectField);
