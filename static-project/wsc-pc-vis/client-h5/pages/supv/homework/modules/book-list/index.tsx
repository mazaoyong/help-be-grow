import { createModule, ModelOf } from '@youzan/tany-vue';
import { CommonList } from '@youzan/vis-ui';
import { IWorkbook } from 'domain/supv/homework/types';
import { createWorkbookListApi } from 'domain/supv/homework/services/workbook';
import Empty from 'components/empty/index.vue';
import WorkbookCard from './components/workbook-card';
import SearchList from './components/search-list'

import './style';
import { useAppModel } from '../../App.model';

const ModuleBookListModel = () => {
  const { setCurrentBookTitle } = useAppModel();

  return {
    setCurrentBookTitle,
    workbookListApi: createWorkbookListApi(),
  };
};

function ModuleBookList(model: ModelOf<typeof ModuleBookListModel>) {
  return (<div>
      <SearchList />
      <div class="module-book-list">
        <CommonList params={{}} request={model.workbookListApi} { ...{ scopedSlots: {
          default: (props: { index: number, item: IWorkbook }) => {
            return (
              <WorkbookCard
                id={props.item.id}
                title={props.item.title}
                homeworkNumber={props.item.homeworkNum}
                toCorrectNumber={props.item.toReviewNum}
                setCurrentBookTitle={model.setCurrentBookTitle}
              />
            );
          }
        } }}>
          <Empty slot="empty" desc="暂无作业本" />
        </CommonList>
      </div>
    </div>
  );
};

export default createModule({
  root: ModuleBookList,
  rootModel: ModuleBookListModel,
});
