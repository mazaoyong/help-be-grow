import React from 'react';

import styles from './styles.m.scss';

export interface IBatchStatusProps {
  status?: 'success' | 'fail' | 'process';
  errMsg?: string | Error;
}

const statusLabel = {
  success: {
    title: '修改完成',
    desc: '',
  },
  fail: {
    title: '修改失败',
  },
  process: {
    title: '批量修改中...',
    desc: '请勿关闭弹窗或进行其他操作，否则可能导致修改失败。',
  },
};

function getErrMsg(errMsg: Error | string) {
  if (typeof errMsg === 'string') return errMsg;
  return errMsg.message;
}

export default function BatchStatus(props: IBatchStatusProps) {
  const { errMsg = '', status = 'success' } = props;
  const statusIconClass = styles[`${status}Icon`];
  const title = statusLabel[status].title;

  const desc = status === 'fail' ? getErrMsg(errMsg) : statusLabel[status].desc;

  return (
    <div className={styles.status}>
      <div className={styles.header}>
        <div className={styles.headerTip}>
          <span className={`${styles.headerIcon} ${statusIconClass}`} />
        </div>
        <div className={styles.headerTitle}>{title}</div>
        <div className={styles.headerDesc}>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
}
