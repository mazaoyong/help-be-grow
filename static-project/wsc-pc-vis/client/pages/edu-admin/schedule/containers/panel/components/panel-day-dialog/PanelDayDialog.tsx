import React from 'react';
import { Dialog } from 'zent';
import PanelDayDialogContent, { IPanelDayPanelProps } from './PanelDayDialogContent';
import formatDate from 'zan-utils/date/formatDate';
import getCurrentWeek from 'zan-utils/date/getCurrentWeek';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'panel-day-dialog';

const open: (options: IPanelDayPanelProps) => void = (options) => {
  const { time } = options;
  const date = formatDate(time, 'YYYY-MM-DD');
  const week = getCurrentWeek(time);

  openDialog({
    className: 'panel-day-dialog',
    dialogId: dialogId,
    title: `${date} ${week}`,
    children: (
      <PanelDayDialogContent {...options} closeDialog={close} />
    ),
    onClose() {},
  });
};

const close = () => {
  closeDialog(dialogId);
};

export default { open, close };
