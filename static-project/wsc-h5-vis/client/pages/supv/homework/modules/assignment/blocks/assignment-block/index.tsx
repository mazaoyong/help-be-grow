import { createBlock, ModelOf } from '@youzan/tany-vue';
import AssignmentBlockModel from './model';

import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import MediaContainer from 'vis-shared/components/supv/homework/media-container';
import HomeworkScore from 'vis-shared/components/supv/homework/homework-score';
import WriteHomeworkPopup from "../../../../components/write-homework-popup";
import { Button } from "vant";

import { format } from 'date-fns';

import './style.scss';

function AssignmentBlock(model: ModelOf<typeof AssignmentBlockModel>) {
  const {
    assignmentInfo: {
      name,
      avatar,
      commitDate,
      scoreRule,
      scoreStyle,
      score,
      isExcellent,
      mediaBlocks,
      hasCorrected,
      deadline,
      targetKdtId,
    },
    showWriteHomeworkPopup,
    setShowWriteHomeworkPopup,
    studentId,
    assignmentId,
    isSelfHomework,
    setSubmit,
    loaded
  } = model;

  return (
    <div class="assignment-block">
      <FeedCard
        title={`${name}的作业`}
        leftImage={avatar}
        rounded
        desc={`提交于 ${format(commitDate, "YYYY-MM-DD HH:mm")}`}
        titleSize="normal"
        loading={!loaded.value}
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
        {
          isSelfHomework.value
          ? (
            <div>
              <Button
                onClick={() => setShowWriteHomeworkPopup(true)}
                props={{ round: true, size: "large" }}
              >
                修改作业
              </Button>
              <WriteHomeworkPopup
                open={showWriteHomeworkPopup.value}
                setOpen={setShowWriteHomeworkPopup}
                mediaBlocks={mediaBlocks}
                assignmentId={assignmentId.value}
                studentId={studentId.value}
                deadline={deadline}
                targetKdtId={targetKdtId}
                setSubmitted={setSubmit}
                hasWritten={true}
              />
            </div>
          ) : null
        }
      </FeedCard>
    </div>
  );
}

export default createBlock({
  model: AssignmentBlockModel,
  root: AssignmentBlock,
});