import { createComponent } from '@youzan/tany-vue';

import { HomeworkScoreStyleEnum } from '@/domain/assignment-domain/entities/assignment';

import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer, { IMediaBlock } from 'vis-shared/components/supv/homework/media-container';
import HomeworkScore, { HomeworkScoreRuleEnum } from 'vis-shared/components/supv/homework/homework-score';

import { format } from 'date-fns';

export interface IAssignmentProps {
  name: string;
  commitDate: Date;
  avatar: string;
  scoreRule: HomeworkScoreRuleEnum;
  scoreStyle: HomeworkScoreStyleEnum;
  score: number | string;
  isExcellent: boolean;
  mediaBlocks: IMediaBlock[];
  hasCorrected: boolean;
}

function Assignment(props: IAssignmentProps) {
  const { name, avatar, commitDate, scoreRule, scoreStyle, score, isExcellent, mediaBlocks, hasCorrected } = props;

  return (
    <FeedCard
      title={`${name}的作业`}
      leftImage={avatar}
      rounded={true}
      desc={`提交于 ${format(commitDate, 'YYYY-MM-DD HH:mm')}`}
      titleSize="normal"
    >
      <MediaContainer 
        slot="content" 
        mode="grid" 
        mediaBlocks={mediaBlocks}
        playVideoInAnotherPage={true}
      />

      {hasCorrected ? (
        <HomeworkScore
          slot="badge"
          scoreRule={scoreRule}
          scoreStyle={scoreStyle}
          score={score}
          isExcellent={isExcellent}
        />
      ) : null}
    </FeedCard>
  );
}

export default createComponent(Assignment, {
  initialState: {
    name: '',
    commitDate: new Date(),
    avatar: '',
    scoreRule: HomeworkScoreRuleEnum.HUNDRED,
    scoreStyle: HomeworkScoreStyleEnum.GRADE,
    score: '',
    isExcellent: false,
    mediaBlocks: [],
    hasCorrected: false,
  }
});
