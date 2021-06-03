import { Tabs as VanTabs, Tab as VanTab } from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import { CommonList } from '@youzan/vis-ui';
import {
  IAssignmentPageDTO,
} from 'definitions/api/owl/pc/AssignmentFacade/findHomeworkAssignmentPage';
import ListModel from './model';
import { StudentCard } from './fragments/student-card';
import Empty from 'components/empty/index.vue';
import './style';
import Homework from 'domain/supv/homework/entities/Homework';

const createTab = (
  title: string,
  api: any,
  emptyDesc: string,
  Card: (item: IAssignmentPageDTO, index: number) => JSX.Element,
) => {
  return (
    <VanTab title={title}>
      <CommonList params={{}} request={api} { ...{ scopedSlots: {
        default: (props: { index: number, item: IAssignmentPageDTO }) => {
          return Card(props.item, props.index);
        }
      } }}>
        <Empty slot="empty" desc={emptyDesc} />
      </CommonList>
    </VanTab>
  );
};

function List(model: ModelOf<typeof ListModel>) {
  return (
    <div class="block block-list">
      <VanTabs color="#00b389" titleActiveColor="#00b389" titleInactiveColor="#969799">
        {createTab(
          model.unreviewedTitle.value,
          model.unreviewedApi,
          '暂无学员提交作业',
          (item: IAssignmentPageDTO, index: number) => StudentCard(
            item,
            model.homeworkDetail.value as Homework,
            false,
            () => {
              model.setReviewPageData('isReviewed', false);
              model.setReviewPageData('total', model.unreviewedTotal);
              model.setReviewPageData('currentIndex', index);
            },
          ),
        )}
        {createTab(
          model.reviewedTitle.value,
          model.reviewedApi,
          '暂无需要批阅的作业',
          (item: IAssignmentPageDTO, index: number) => StudentCard(
            item,
            model.homeworkDetail.value as Homework,
            true,
            () => {
              model.setReviewPageData('isReviewed', true);
              model.setReviewPageData('total', model.reviewedTotal);
              model.setReviewPageData('currentIndex', index);
            },
          ),
        )}
      </VanTabs>
    </div>
  );
};

export default createBlock({
  model: ListModel,
  root: List
});
