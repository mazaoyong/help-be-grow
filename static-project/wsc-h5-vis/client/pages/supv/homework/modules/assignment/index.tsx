import { createModule, ModelOf } from '@youzan/tany-vue';
import AssignmentModuleModel from './model';

import HomeworkBlock from './blocks/homework-detail-block';
import AssignmentBlock from './blocks/assignment-block';
import CorrectBlock from './blocks/correct-block';
import BottomOperationBlock from './blocks/bottom-operation-block';

import Empty from 'vis-shared/components/empty';

import './style.scss';

function AssignmentModule(model: ModelOf<typeof AssignmentModuleModel>) {
  const {
    hasCorrected,
    loaded,
    operationsLoaded,
    assignmentInfo,
    workbookDeleted
  } = model;

  return (
    <div class="assignment">
      {
        !workbookDeleted.value
        ? (
          <div class="assignment__content" excellent={assignmentInfo.isExcellent}>
            <HomeworkBlock />
            <AssignmentBlock />
            {
              !loaded.value || hasCorrected.value
              ? (<CorrectBlock />)
              : null
            }
            {
              operationsLoaded.value
              ? (<BottomOperationBlock />)
              : null
            }
          </div>
        ) : (<Empty infoText="作业已被删除，请和老师联系"/>)
      }
    </div>
  );
}

export default createModule({
  rootModel: AssignmentModuleModel,
  root: AssignmentModule,
});