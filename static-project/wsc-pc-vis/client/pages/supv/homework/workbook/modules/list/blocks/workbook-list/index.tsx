import { React, createBlock, useCallback } from '@youzan/tany-react';
import { EasyList } from '@youzan/ebiz-components';
import { Button as SamButton } from '@youzan/sam-components';
import { abilityCheck } from 'fns/auth/ability-check-status';
import WorkbookListModel, { AssignmentListModelType } from '../../models/workbook-list';
import WorkbookPromotion from '../../components/promotion-dialog';
import { workbookCreateRoute } from '../../../../router';
import { APPID, AbilityCode, AppName } from '../../../../../constants';

const { List, EasyGrid, Filter } = EasyList;

const LIST_PAGE_SIZE = 10;

const WorkbookList = (workbookListModel: AssignmentListModelType) => {
  const {
    isEduHqStore,
    handleFetchWorkbookList,
    filterConfig,
    columns,
    emptyLabel,
    listRef,
    filterRef,
  } = workbookListModel;

  const handleCreate = useCallback(() => {
    abilityCheck({
      abilityCode: AbilityCode,
      appId: APPID,
      name: AppName
    }).then(() => {
      workbookCreateRoute.push();
    });
  }, []);

  return (
    <>
      {!isEduHqStore && (
        <SamButton
          className="create-button"
          name="编辑"
          type="primary"
          onClick={handleCreate}
        >
          新建作业本
        </SamButton>
      )}
      <List
        mode="none"
        onSubmit={handleFetchWorkbookList as any}
        ref={listRef}
        defaultFilter={{ pageSize: LIST_PAGE_SIZE }}
        delay={500}
      >
        <Filter
          ref={filterRef}
          config={filterConfig as any} // todo
        />
        <EasyGrid
          columns={columns as any} // todo
          rowKey="id"
          scroll={{ x: 1111 }}
          emptyLabel={emptyLabel}
        />
      </List>
    </>
  );
};

export default createBlock({
  model: WorkbookListModel,
  root: WorkbookList,
  components: [List, WorkbookPromotion],
});
