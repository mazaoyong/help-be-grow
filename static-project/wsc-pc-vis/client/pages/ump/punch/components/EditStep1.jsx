
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Button } from 'zent';

import CoverField from 'components/field/cover';
import PunchDetailField from './punch-design';

const { createForm, Field, FormInputField } = Form;

class Step1Form extends Component {
  state = {};

  nextStep = data => {
    this.props.nextStep(data);
  };

  render() {
    const { name, pictureData, description } = this.props.data;
    const { handleSubmit } = this.props;

    return (
      <Form horizontal className="split-form" onSubmit={handleSubmit(this.nextStep)}>
        <i className="split" />
        <h3 className="split-title"> 基本信息 </h3>
        <FormInputField
          name="name"
          label="打卡名称："
          type="text"
          autoComplete="off"
          placeholder="最多输入20字"
          value={name}
          required
          validations={{
            required: true,
            maxLength: 20,
          }}
          validationErrors={{
            required: '请填写打卡名称',
            maxLength: '最多 20 个汉字',
          }}
        />
        <Field
          name="pictureData"
          label="打卡封面："
          helpDesc="建议尺寸：750*420像素，小于1M，支持jpg、png、jpeg格式"
          component={CoverField}
          uploadCls="content-upload"
          value={pictureData}
          detail
          validations={{
            validData(_, value) {
              return !!(value && value.cover);
            },
          }}
          validationErrors={{
            validData: '必须上传一张图片作为打卡封面',
          }}
          required
        />
        <Field
          name="description"
          label="打卡详情："
          component={PunchDetailField}
          value={description}
          validateOnBlur
          validations={{
            required: (values, value) => {
              if (value.length > 0) {
                return true;
              }
            },
          }}
          validationErrors={{
            required: '请输入打卡详情',
          }}
          required
        />
        <div className="app-design">
          <div className="app-actions no-left-right-consider">
            <div className="form-actions new-actions text-center">
              <Button
                onClick={() => {
                  hashHistory.goBack();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={this.state.loading}>
                下一步
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default createForm({ scrollToError: true })(Step1Form);
