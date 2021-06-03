import { createComponent } from '@youzan/tany-vue';

import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer, { IMediaBlock } from 'vis-shared/components/supv/homework/media-container';

import { getCommentIcon } from 'supv/homework/utils';

import { format } from 'date-fns';

export interface ICorrectProps {
  correctDate: Date;
  mediaBlocks: IMediaBlock[];
}

const commentIcon = getCommentIcon();

function Correct(props: ICorrectProps) {
  const {
    correctDate,
    mediaBlocks,
  } = props;

  return (
    <div class="correct-block">
      <FeedCard
        title="老师点评"
        leftImage={commentIcon}
        desc={`批改于 ${format(correctDate, "YYYY-MM-DD HH:mm")}`}
        titleSize="normal"
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

export default createComponent(Correct, {
  initialState: {
    correctDate: new Date(),
    mediaBlocks: [],
  }
});