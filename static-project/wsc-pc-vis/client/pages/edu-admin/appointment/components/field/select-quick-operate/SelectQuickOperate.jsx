import { Select, Pop, Form } from '@zent/compat';
import React, { Component, Fragment } from 'react';
import { Select as EbizSelect } from '@youzan/ebiz-components';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class SelectQuickOperate extends Component {
  render() {
    const { presets = [], extraComponent, async, ...rest } = this.props;
    const passableProps = omit(rest, unknownProps);
    const comp = (
      <div className="select-quick-operate">
        <div className="select-quick-operate__left">
          {async ? (
            <EbizSelect {...passableProps} />
          ) : (
            <Select {...passableProps} />
          )}
          {!!extraComponent && extraComponent}
        </div>
        <div className="select-quick-operate__actions">
          {presets.map((action, index) => {
            return (
              <Fragment key={index}>
                <div
                  className="select-quick-operate__action"
                  onClick={action.callback || this.getSelectData}
                >
                  {action.text}
                </div>
                {presets.length - 1 !== index && <div className="select-quick-operate__gap-line" />}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
    if (passableProps.disabled && passableProps.name === 'assetNo' && !passableProps.studentId) {
      return (
        <Pop trigger="hover" content="请先选择学员">
          {comp}
        </Pop>
      );
    }
    return comp;
  }
}

const SelectQuickOperateField = getControlGroup(SelectQuickOperate);

export default SelectQuickOperateField;
