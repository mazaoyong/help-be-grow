import ExpressDialog from './ExpressDialog';
import openDialog from './open';

const DIALOG_ID = 'wsc-order-express-dialog';

import './style.scss';

/**
 * 发货弹框
 */
export default function openExpressDialog(options) {
  return openDialog(
    {
      dialogId: DIALOG_ID,
      ...options,
    },
    ExpressDialog,
  );
}
