import React from 'react';
import { Dialog } from 'zent';
import PanelDayDialogContent from './PanelDayDialogContent';
import formatDate from 'zan-utils/date/formatDate';
import getCurrentWeek from 'zan-utils/date/getCurrentWeek';
const { openDialog, closeDialog } = Dialog;

const dialogId = 'panel-day-dialog';

const open = (options = {}) => {
  const { defaultData = {}, ...restOptions } = options;
  const date = formatDate(defaultData.time, 'YYYY-MM-DD');
  const week = getCurrentWeek(defaultData.time);

  openDialog({
    className: 'panel-day-dialog',
    dialogId: dialogId,
    title: `${date} ${week}`,
    children: (
      <PanelDayDialogContent defaultData={defaultData} {...restOptions} closeDialog={close} />
    ),
    onClose() {},
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
