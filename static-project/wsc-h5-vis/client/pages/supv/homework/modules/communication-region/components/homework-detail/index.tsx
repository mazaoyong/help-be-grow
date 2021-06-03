import { createComponent } from '@youzan/tany-vue';

import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer, { IMediaBlock } from 'vis-shared/components/supv/homework/media-container';

import { format } from 'date-fns';
import { getThemeColor } from '@youzan/vue-theme-plugin';

export interface IHomeworkDetailProps {
  title: string;
  publishDate: Date;
  mediaBlocks: IMediaBlock[];
}

const mainColor: string = getThemeColor('main');

function HomeworkDetail(props: IHomeworkDetailProps) {
  const {
    title,
    publishDate,
    mediaBlocks,
  } = props;

  return (
    <div class="homework-detail-block">
      <FeedCard
        title={title}
        desc={`发布于 ${format(publishDate, "YYYY-MM-DD HH:mm")}`}
        titleSize="large"
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

export default createComponent(HomeworkDetail, {
  initialState: {
    title: '',
    publishDate: new Date(),
    mediaBlocks: [],
  }
});