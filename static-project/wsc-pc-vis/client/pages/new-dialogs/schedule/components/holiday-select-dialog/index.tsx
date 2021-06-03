import React, { useState, FC, useEffect } from 'react';
import { Dialog, Button } from 'zent';
import { HolidayList } from '../../../../edu-admin/components/holiday-list';
import { CustomHolidayData } from '../../../../edu-admin/api/holiday';

interface HolidaySelectDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (selected: CustomHolidayData[]) => void;
  // 空列表时会出现新建链接，点击打开新建窗口
  onCreate: () => void;
  selected: CustomHolidayData[];
  // 只查询指定校区+总部节假日
  queryKdtId?: number;
}

function diffSelect(now, ids, rows) {
  rows.forEach(sel => {
    if (!now.some(data => data.id === sel.id)) now.push(sel);
  });
  return now.filter(it => ids.includes(it.id));
}

export const HolidaySelectDialog: FC<HolidaySelectDialogProps> = ({
  visible, onClose, onSelect, selected, onCreate, queryKdtId,
}) => {
  const [selectedRow, setSelectedRow] = useState<CustomHolidayData[]>(selected.slice(0));
  useEffect(() => {
    setSelectedRow(selected.slice(0));
  }, [selected]);

  return (
    <Dialog
      visible={visible}
      title="选择节假日"
      onClose={onClose}
      footer={<>
        <Button
          onClick={() => {
            setSelectedRow(selected.slice(0));
            onClose();
          }}
        >取消</Button>
        <Button type="primary" onClick={() => onSelect(selectedRow)}>确定</Button>
      </>}
    >
      <HolidayList
        type="select"
        onCreate={onCreate}
        onSelect={(ids, rows) => setSelectedRow(diffSelect(selectedRow, ids, rows))}
        selected={selectedRow.map(it => it.id)}
        queryKdtId={queryKdtId}
        pageSize={6}
      />
    </Dialog>
  );
};
