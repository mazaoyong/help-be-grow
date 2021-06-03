import React from 'react';
import { Steps } from 'zent';

export default function CreateSteps(props) {
  return (
    <Steps current={props.current} type="breadcrumb">
      <Steps.Step title="选择版本" />
      <Steps.Step title="填写信息" />
      <Steps.Step title="完成" />
    </Steps>
  );
}
