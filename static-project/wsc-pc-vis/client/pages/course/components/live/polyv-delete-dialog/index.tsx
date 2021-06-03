import React, { useState } from 'react';
import { Dialog, Checkbox, Button } from 'zent';
import './style.scss';

export default function PolyvDeleteDialog(props) {
  const { visible, onClose, onDelete } = props;
  const [checked, setChecked] = useState(true);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <Dialog
      visible={visible}
      maskClosable={false}
      closeBtn={false}
      title="删除直播"
      footer={<div>
        <Button onClick={() => onDelete(checked)}>
          确认删除
        </Button>
        <Button type="primary" onClick={() => onClose()}>
          我再想想
        </Button>
      </div>}
    >
      <div>
        <p>直播删除后，已购买的用户将无法观看直播，是否确认删除？</p>
        <Checkbox className="mt-8" checked={checked} onChange={handleChange}>
          同时在保利威管理后台删除对应的直播频道
        </Checkbox>
      </div>
    </Dialog>
  );
}
