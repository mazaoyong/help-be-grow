
import { Form as ZentForm } from '@zent/compat';
/**
 * 地址选择组件
 */
import React from 'react';
import { RegionSelect } from '@youzan/react-components';
import '@youzan/react-components/es/components/region-select/style/index.css';

const { getControlGroup } = ZentForm;

const RegionField = getControlGroup(props => {
  let choosedData = props.value;

  const onChange = data => {
    choosedData = data;
    // 如果选择到了县级，立刻更新更新数据，否则只有关闭选择弹框才更新数据触发校验
    if (data.county_id) {
      props.onChange(choosedData);
    }
  };

  const countId = props.value ? props.value.county_id : 0;
  return (<RegionSelect
    value={countId}
    onChange={onChange}
    onPopupVisibleChange={isShow => {
      if (!isShow) {
        props.onChange(choosedData);
      }
    }}
  />);
});

export default RegionField;
