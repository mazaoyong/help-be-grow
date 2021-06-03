import { createModule, ModelOf } from '@youzan/tany-vue';
import CommunicationRegionModuleModel from './model';

import HomeworkDetail from './components/homework-detail';
import Assignment from './components/assignment';
import Correct from './components/correct';

import Swipe from 'vis-shared/components/supv/homework/page-swipe';
import Empty from 'vis-shared/components/empty';

import './style.scss';

function CommunicationRegionModule(model: ModelOf<typeof CommunicationRegionModuleModel>) {
  const {
    hasNext,
    handleNext,
    hasPrev,
    handlePrev,
    dataList,
    loaded,
    workbookDeleted,
  } = model;

  return (
    <div class="assignment">
      {
        !workbookDeleted.value
        ? (
          loaded.value
          ? (
            <Swipe
              handlePrev={handlePrev}
              showPrev={hasPrev.value}
              prevText="上一篇"
              handleNext={handleNext}
              showNext={hasNext.value}
              nextText="下一篇"
              list={
                dataList.value.map((assignment) => {
                  const data = assignment.assignment;
                  return assignment.loaded ?
                  (
                    <div
                      class="other-assignment"
                      excellent={data.hasReviewed && data.reviewDTO.comment.excellentScore}
                    >
                      <HomeworkDetail
                        title={data.homework.title}
                        publishDate={new Date(data.homework.publishTime)}
                        mediaBlocks={data.homework.detail}
                      />
                      <Assignment
                        name={data.studentDTO.name}
                        commitDate={new Date(data.submitTime)}
                        avatar={data.studentDTO.avatar}
                        scoreRule={data.homework.scoreRule}
                        scoreStyle={data.homework.scoreStyle}
                        score={data.hasReviewed ? data.reviewDTO.comment.score : ''}
                        isExcellent={data.hasReviewed && data.reviewDTO.comment.excellentScore}
                        mediaBlocks={data.answerDetail}
                        hasCorrected={data.hasReviewed}
                      />
                      {
                        data.hasReviewed
                        ? (
                          <Correct
                            correctDate={new Date(data.reviewDTO.reviewTime)}
                            mediaBlocks={data.reviewDTO.comment.comment}
                          />
                        )
                        : null
                      }
                    </div>
                  ) : null;
                })
              }
            />
          ) : null
        ) : (<Empty infoText="作业已被删除，请和老师联系"/>)
      }
    </div>
  );
}

export default createModule({
  rootModel: CommunicationRegionModuleModel,
  root: CommunicationRegionModule,
});