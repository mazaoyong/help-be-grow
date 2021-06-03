import React, { FC } from 'react';
import { Dialog, Alert } from 'zent';
import HolidayEditForm from './edit-form';
import { CustomHolidayData } from '../../../../../api/holiday';

interface HolidayModifyProps {
  create?: boolean;
  visible?: boolean;
  onClose: () => void;
  onModify: (item, create) => void | Promise<void>;
  modifyItem?: CustomHolidayData;
}

const formatItem = item => ({
  startTime: `${item.daterange[0]} 00:00:00`,
  endTime: `${item.daterange[1]} 23:59:59`,
  name: item.name,
});

/** 新建/编辑节假日对话框 */
export const HolidayModify: FC<HolidayModifyProps> = ({
  create = false, visible = false, onClose, modifyItem, onModify,
}) => {
  return (
    <Dialog
      maskClosable={false}
      visible={visible}
      title={create ? '新建节假日' : '编辑节假日'}
      onClose={onClose}
    >
      {!create && <Alert style={{ marginBottom: 16 }}>修改节假日仅对后续排课生效，不影响已排课的日程。</Alert>}
      <HolidayEditForm
        modifyItem={modifyItem}
        onCancel={onClose}
        onSubmit={(item) => onModify(formatItem(item), create)}
      />
    </Dialog>
  );
};
