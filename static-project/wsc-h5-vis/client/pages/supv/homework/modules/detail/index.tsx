import { createBlock, ModelOf } from '@youzan/tany-vue';
import { Button } from 'vant';
import FeedCard from 'vis-shared/components/supv/homework/feed-card/index.vue';
import AppModel from './model';
import MediaContainer from 'vis-shared/components/supv/homework/media-container';
import WriteHomeworkPopup from '../../components/write-homework-popup';
import Empty from 'vis-shared/components/empty';
import './style.scss';
import { format } from 'date-fns';

function App(model: ModelOf<typeof AppModel>) {
  const {
    mainColor,

    assignment,
    showWriteHomeworkPopup,
    setShowWriteHomeworkPopup,
    studentId,
    submitted,
    setSubmitted,
    deadline,
    isOvertime,
    loaded,
    loadedAssignmentId,
    isSelfHomework,
    isPublished,
    targetKdtId,
    buttonText,
    isActionable,
    descText,
    workbookDeleted
  } = model;

  return (
    <div class="homework-detail">
      {
        loaded.value
        ? (
          !workbookDeleted.value
          ? (
            <div>
              <FeedCard
                title={assignment.value?.homework.title}
                desc={descText.value}
                titleSize="large"
              >

              <MediaContainer 
                slot="content"
                mode="list"
                mediaBlocks={assignment.value?.homework.detail || []}
                color={ mainColor }
              />

              </FeedCard>
              {
                isSelfHomework.value
                ? (
                  <div class="homework-detail__bottom">
                    {
                      assignment.value?.homework.deadline && !submitted.value && isPublished.value
                      ? (
                        <div class="homework-detail__notice">
                          { 
                            new Date(assignment.value?.homework.deadline) < new Date() || isOvertime.value
                            ? `截止于${format(assignment.value?.homework.deadline, 'YYYY-MM-DD HH:mm')}`
                            : `请于${format(assignment.value?.homework.deadline, 'YYYY-MM-DD HH:mm')} 前提交作业`
                          }
                        </div>
                      ) : null
                    }
                    <Button 
                      color={ isActionable.value ? mainColor : '#c8c9cc' } 
                      onClick={ () => {  isActionable.value && setShowWriteHomeworkPopup(true) } } 
                      props={{ round: true, size: 'large' }}
                    >
                      {buttonText.value}
                    </Button>
                    <WriteHomeworkPopup
                      open={showWriteHomeworkPopup.value}
                      setOpen={setShowWriteHomeworkPopup}
                      setSubmitted={setSubmitted}
                      mediaBlocks={assignment.value?.answerDraft}
                      assignmentId={loadedAssignmentId.value}
                      studentId={studentId.value}
                      deadline={deadline.value}
                      targetKdtId={targetKdtId.value}
                      hasWritten={submitted.value}
                    />
                  </div>
                ) : null
              }
            </div>
          )
          : (<Empty infoText="作业已被删除，请和老师联系"/>)
        )
        : null
      }
    </div>
  );
};

export default createBlock({
  model: AppModel,
  root: App
});
