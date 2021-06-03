import { Icon as VanIcon } from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import BlockSeclectedEntryModel from './model';
import { reviewRoute } from '@/pages/supv/homework/router';
import './style';

const Link = reviewRoute.getLinkComponent();

function BlockSeclectedEntry(model: ModelOf<typeof BlockSeclectedEntryModel>) {
  return (
    <div class="block block-selected-entry">
      <Link
        params={{ assignmentId: model.homeworkDetail.value.selectedId }}
        props={{
          onClick: model.setReviewPageData,
        }}
      >
        <span><strong>{model.homeworkDetail.value.selectedCount}</strong> 个</span>
        <VanIcon name="arrow" size="12px" color="00b389"/>
      </Link>
    </div>
  );
}

export default createBlock({
  root: BlockSeclectedEntry,
  model: BlockSeclectedEntryModel,
});
