import { React, createBlock, ModelOf } from '@youzan/tany-react';
import HomeworkListComponent from '../../components/homework-list';
import useHomeworkListModel from '../../models/homework-list';
import useWorkbookSummaryModel from '../../models/workbook-summary';

import './styles.scss';

const ListModel = () => {
  const homeworkListModel = useHomeworkListModel();

  const { workbookId, isAuthorizedTeacher } = useWorkbookSummaryModel();

  return {
    workbookId,
    isAuthorizedTeacher,
    ...homeworkListModel,
  };
};

type ListModelType = ModelOf<typeof ListModel>;

const HomeworkList = (HomeworkListModel: ListModelType) => {
  const {
    isAuthorizedTeacher,
    handleFetchWorkbookList,
    homeworkColumns,
    listRef,
    emptyLabel,
    homeworkCreateLink,
  } = HomeworkListModel;

  return (
    <div className="homework-list">
      <HomeworkListComponent
        ref={listRef as any}
        onSubmit={handleFetchWorkbookList as any}
        isAuthorizedTeacher={isAuthorizedTeacher}
        homeworkCreateLink={homeworkCreateLink}
        columns={homeworkColumns as any}
        emptyLabel={emptyLabel}
      />
    </div>
  );
};

export default createBlock({
  root: HomeworkList,
  model: ListModel,
});
