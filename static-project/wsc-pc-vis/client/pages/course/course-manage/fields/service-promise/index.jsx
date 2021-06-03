import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, LayoutRow as Row } from 'zent';
import openDemoImg from '../../../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from '../../constants';
import cx from 'classnames';
import './index.scss';

const { FormRadioGroupField } = Form;

export default class ServicePromise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onChange = (e) => this.setState({ value: e.target.value });

  render() {
    let { label, servicePledge, courseType } = this.props;
    return (
      <div className="service-promise-group">
        <FormRadioGroupField
          name="servicePledge"
          label={label}
          value={servicePledge}
          onChange={this.onChange}
          className={cx({ hide: courseType === 1 })}
        >
          <Row>
            <Radio value={0}>不显示</Radio>
          </Row>
          <Row>
            <Radio value={1}>免预约</Radio>
          </Row>
          <Row>
            <Radio value={2}>二次确认</Radio>
          </Row>
          <div className="help-block">
            <span style={{ marginLeft: '23px' }}>设置后,会在购买流程中显示服务承诺。</span>
            <Pop
              trigger="click"
              content={
                this.state.value === 2
                  ? openDemoImg(DEMO_IMG.SERVICE, DEMO_TEXT.SERVICE)
                  : openDemoImg(DEMO_IMG.FREE, DEMO_TEXT.FREE)
              }
              position="right-top"
              className="course-example-pop"
            >
              <a href="javascript:;">查看示例</a>
            </Pop>
          </div>
        </FormRadioGroupField>
      </div>
    );
  }
}
