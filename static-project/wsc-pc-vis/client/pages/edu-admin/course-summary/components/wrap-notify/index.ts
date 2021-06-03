import { Notify } from 'zent';

export const wrapNotify = {
  error(err: string | Error) {
    if (typeof err === 'string') return Notify.error(err);
    return Notify.error(err.message);
  },
};
