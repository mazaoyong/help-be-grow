import { createBlock, ModelOf } from '@youzan/tany-vue';
import CorrectBlockModel from './model';

import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer from 'vis-shared/components/supv/homework/media-container';

import { format } from 'date-fns';

import './style.scss';

function CorrectBlock(model: ModelOf<typeof CorrectBlockModel>) {
  const {
    correctInfo: {
      correctDate,
      mediaBlocks,
    },
    commentIcon,
    loaded
  } = model;

  return (
    <div class="correct-block">
      <FeedCard
        title="老师点评"
        leftImage={commentIcon}
        desc={`批改于 ${format(correctDate, "YYYY-MM-DD HH:mm")}`}
        titleSize="normal"
        loading={!loaded.value}
      >
        <MediaContainer 
          slot="content" 
          mode="grid" 
          mediaBlocks={mediaBlocks}
          playVideoInAnotherPage={true}
        />
      </FeedCard>
    </div>
  );
}

export default createBlock({
  model: CorrectBlockModel,
  root: CorrectBlock,
});