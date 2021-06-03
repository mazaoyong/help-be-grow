
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, LayoutRow as Row, LayoutCol as Col } from 'zent';
import './index.scss';

const { FormRadioGroupField, FormDatePickerField } = Form;

export default class Publish extends Component {
  state = {
    visible: false,
  };
  onChangeDate = val => {
    this.props.onChange({ publishStatus: 2, timingPublishAt: val });
  };
  onVisible = () => {
    if (this.props.disabledMsg) {
      this.setState({ visible: true });
    }
  };
  onInvisible = () => {
    if (this.props.disabledMsg) {
      this.setState({ visible: false });
    }
  };
  render() {
    const { label, publishStatus, timingPublishAt, disabled, disabledMsg } = this.props;
    return (
      <div className="publish-type-group">
        {this.props.disabledMsg && (
          <div
            className="publish-type-group-mask"
            onMouseOver={this.onVisible}
            onMouseOut={this.onInvisible}
          />
        )}
        <Pop
          position="top-left"
          block
          content={disabledMsg}
          visible={this.state.visible}
          onVisibleChange={() => { }}
        >
          <FormRadioGroupField
            name="publishStatus"
            value={publishStatus}
            label={label}
            disabled={disabled}
            required
          >
            <Row>
              <Radio value={1}>立即开售</Radio>
            </Row>
            <Row className="toc-row">
              <Col span={11}>
                <Radio value={2}>定时开售，设置开售时间:</Radio>
              </Col>
              <Col span={13}>
                <FormDatePickerField
                  name="timingPublishAt"
                  className="zent-picker-demo publish-type-group__time"
                  showTime
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                  min={new Date()}
                  value={timingPublishAt}
                  onChange={() => this.onChangeDate}
                  disabled={publishStatus !== 2}
                  validations={{
                    required(_, value) {
                      if (publishStatus === 2) {
                        return !!value;
                      }
                      return true;
                    },
                  }}
                  validationErrors={{
                    required: '请输入上架时间',
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Radio value={3}>暂不开售,存为草稿</Radio>
            </Row>
          </FormRadioGroupField>
        </Pop>
      </div>
    );
  }
}
