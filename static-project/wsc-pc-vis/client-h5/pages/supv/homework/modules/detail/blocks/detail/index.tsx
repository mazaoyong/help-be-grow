import { Icon as VanIcon } from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import FeedCard from '@/vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer from '@/vis-shared/components/supv/homework/media-container';
import BlockDetailModel from './model';
import './style';

import { editBookRoute } from '../../../../router';
import { format } from 'date-fns';

const Link = editBookRoute.getLinkComponent();

function BlockDetail(model: ModelOf<typeof BlockDetailModel>) {
  const homework = model.homeworkDetail.value;

  return (
    <div class="block block-detail">
      <FeedCard
        title={homework.title}
        desc={`布置于 ${format(homework.publishSettings.publishTime || Date.now(), 'YYYY-MM-DD HH:mm')}`}
        titleSize="large"
      >
        <MediaContainer
          slot="content"
          mode="list"
          overflowStyle="collapse"
          mediaBlocks={homework.detail}
        />

        <Link
          slot="operation"
          params={{ homeworkId: model.homeworkId.value }}
          props={{
            onClick: () => { model.setBackWhenFinish(true); },
          }}
        >
          <div class="block-detail__btn-edit">
            <VanIcon
              name="edit"
              size="12"
              color="#A0A1A3"
            />
            再次编辑
          </div>
        </Link>
      </FeedCard>
    </div>
  );
}

export default createBlock({
  root: BlockDetail,
  model: BlockDetailModel,
});
