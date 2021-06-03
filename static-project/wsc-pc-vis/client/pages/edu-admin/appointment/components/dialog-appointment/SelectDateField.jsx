
import { Select, Form } from '@zent/compat';
import React from 'react';
import { Divider } from '@youzan/react-components';
import { omit } from 'lodash';
import { ScheduleNewDialog } from '../../../../new-dialogs';

const { getControlGroup, Field, unknownProps } = Form;

class SelectField extends React.PureComponent {
  render() {
    const passableProps = omit(this.props, unknownProps);
    const { data, value, onChange, onRefresh } = this.props;

    const items = [
      <a href="javascript:;" onClick={() => ScheduleNewDialog.open('新建日程')} key={0}>
        新建日程
      </a>,
      <a href="javascript:;" onClick={onRefresh} key={1}>
        刷新
      </a>,
    ];

    return (
      <>
        <Select data={data} value={value} onChange={onChange} {...passableProps} />
        <Divider items={items} />
      </>
    );
  }
}

const WrapperField = getControlGroup(SelectField);

export default function SelectDateField(props) {
  return <Field {...props} component={WrapperField} />;
}
