import React, { memo } from 'react';

import {
  AddItem,
  SystemAddItem,
  UpdatePhaseItem,
  UpdateOwnersItem,
  UpdateTagsItem,
  UpdateRecordItem,
  UpdateStuItem,
} from '../clue-records-item';

/**
 * recordType
 * 1: 添加线索
 * 2: 更新基本资料
 * 3: 更新阶段
 * 4: 更新标签
 * 5: 变更跟进人
 * 6: 变更跟进记录
 * 7: 提交报名表单信息
 * 8: 体验课报名
 * 9: 好友助力
 * 10: 公众号海报
 * 12: 品牌官网
 */

const ClueReadordsItem = memo(({ data }) => {
  const { recordType } = data;

  switch (recordType) {
    case 1:
      return <AddItem data={data} />;

    case 2:
      return <UpdateStuItem data={data} />;

    case 3:
      return <UpdatePhaseItem data={data} />;

    case 4:
      return <UpdateTagsItem data={data} />;

    case 5:
      return <UpdateOwnersItem data={data} />;

    case 6:
      return <UpdateRecordItem data={data} />;

    case 7:
    case 8:
    case 9:
    case 10:
    case 12:
    case 13:
      return <SystemAddItem data={data} />;

    default:
      return null;
  }
});

export default ClueReadordsItem;
