import { createModule, ModelOf } from '@youzan/tany-vue';
import WorkbookModuleModel from './model';

import JoinBlock from './blocks/join-block';

import Empty from 'vis-shared/components/empty';

import './style.scss';

function WorkbookModule(model: ModelOf<typeof WorkbookModuleModel>) {
  const {
    isEmpty,
  } = model;

  return (
    <div class="workbook">
      { isEmpty.value
        ? (<Empty infoText="作业本已被删除，请和老师联系"/>)
        : (<JoinBlock />)
      }
    </div>
  )
}

export default createModule({
  rootModel: WorkbookModuleModel,
  root: WorkbookModule,
});