import { Pop } from '@zent/compat';
import React from 'react';
import { Icon } from 'zent';
import './styles.scss';

// 显示失败原因的组件
const FailedContent = props => {
  const { failedStatistics } = props;
  return (
    <div>
      <p>导入失败原因:</p>
      {failedStatistics.map(failedItem => {
        const { cause, count } = failedItem;
        return <p key={cause}>{cause}({count}条)</p>;
      })}
      <p style={{ color: '#999' }}>详情请下载失败报表查看，并根据失败报表意见修改后重新导入</p>
    </div>
  );
};

const FailWithPopup = ({ row }) => {
  const { failedRowNum, failedStatistics } = row || {};
  if (failedRowNum) {
    return (
      <div>
        <span style={{ marginRight: '5px' }}>{failedRowNum}</span>
        <Pop
          trigger="hover"
          position="bottom-center"
          className="failed_popup"
          content={<FailedContent failedStatistics={failedStatistics} />}
        >
          <Icon type="error-circle-o" style={{ color: '#999' }} />
        </Pop>
      </div>
    );
  }
  return 0;
};

export default FailWithPopup;
