import React from 'react';
import { Button } from 'zent';

export default function FootFC(props) {
  const { selectInfo } = props.datasets;
  return <div style={{ textAlign: 'right' }}>
    <span>
      <Button onClick={props.onClose}>取消</Button>
      <Button type="primary" onClick={props.submit}>确定{selectInfo.selectedRows.length ? `（${selectInfo.selectedRows.length}）` : ''}</Button>
    </span>
  </div>;
}
