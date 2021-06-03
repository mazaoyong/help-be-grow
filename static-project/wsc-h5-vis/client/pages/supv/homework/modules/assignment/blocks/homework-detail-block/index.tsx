import { createBlock, ModelOf } from '@youzan/tany-vue';
import HomeworkDetailBlockModel from './model';

import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer from 'vis-shared/components/supv/homework/media-container';

import { format } from 'date-fns';

import './style.scss';

function HomeworkDetailBlock(model: ModelOf<typeof HomeworkDetailBlockModel>) {
  const {
    mainColor,

    homeworkDetailInfo: {
      title,
      publishDate,
      mediaBlocks,
    },
    loaded
  } = model;

  return (
    <div class="homework-detail-block">
      <FeedCard
        title={title}
        desc={`发布于 ${format(publishDate, "YYYY-MM-DD HH:mm")}`}
        titleSize="large"
        avatar={false}
        loading={!loaded.value}
      >
        <MediaContainer
          slot="content"
          mode="list"
          overflowStyle="collapse"
          mediaBlocks={mediaBlocks}
          playVideoInAnotherPage={true}
        />
      </FeedCard>
    </div>
  );
}

export default createBlock({
  model: HomeworkDetailBlockModel,
  root: HomeworkDetailBlock,
});