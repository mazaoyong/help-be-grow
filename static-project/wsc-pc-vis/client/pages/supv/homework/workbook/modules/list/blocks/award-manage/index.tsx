import { React, createBlock } from '@youzan/tany-react';
import AwardManageModel from '../../models/award-manage';
import './index.scss';
import { Grid } from 'zent';
const AwardManage = AwardManageModel => {
  const { columns, tableData } = AwardManageModel;

  return (
    <div className="award-manage-table__wrap">
      <Grid
        bordered
        rowClassName="award-manage__row"
        columns={columns}
        datasets={tableData}
      />
    </div>
  );
};

export default createBlock({
  model: AwardManageModel,
  root: AwardManage,
});
