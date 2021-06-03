
import { Form } from '@zent/compat';
/**
 * 课程商品基本信息
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'zent';

const { getControlGroup, FormInputField } = Form;

class BasicInfo extends Component {
  static propTypes = {
    value: PropTypes.object,
  };

  static defaultProps = {
    value: {
      title: '',
    },
  };

  state = {
    title: '',
  };

  render() {
    const { title } = this.props.value;
    return (
      <Collapse>
        <Collapse.Panel title="基本信息">
          <FormInputField
            name="name"
            label="课程名称："
            width="200px"
            maxLength="10"
            autoComplete="off"
            placeholder="请输入课程名称"
            value={title}
            required
            validateOnBlur
            validations={{ required: true }}
            validationErrors={{ required: '请输入课程名称' }}
          />
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default getControlGroup(BasicInfo);
