import { React, useState, useCallback, createBlock, ModelOf } from '@youzan/tany-react';
import { Collapse, Icon, Button } from 'zent';
import HomeworkDetail from './blocks/homework-detail';
import StudentAnswer from './blocks/student-answer';
import CorrectField from './blocks/correct-field';
import useCorrectPageModel from './models/correct-page';
import { assignmentCorrectRoute } from '../../router';

import './styles.scss';

const homeworkDetailPanelKey = 'HOMEWORK_DETAIL';

const model = () => {
  const {
    studentName,
    homeworkTitle,
    viewPrevAssignmentId,
    viewNextAssignmentId,
    pageQuery,
    handleLeave,
    formLoading,
  } = useCorrectPageModel();

  const [showHomeworkDetail, toggleHomeworkDetailVisible] = useState(false);

  const onHomeworkDetailChange = useCallback((activePanelName: string) => {
    toggleHomeworkDetailVisible(activePanelName === homeworkDetailPanelKey);
  }, []);

  const CorrectLink = assignmentCorrectRoute.getLinkComponent();

  return {
    studentName,
    homeworkTitle,
    showHomeworkDetail,
    onHomeworkDetailChange,
    viewPrevAssignmentId,
    viewNextAssignmentId,
    CorrectLink,
    pageQuery,
    handleLeave,
    formLoading,
  };
};

const AssignmentCorrect = (AssignmentCorrentModel: ModelOf<typeof model>) => {
  const {
    studentName,
    homeworkTitle,
    showHomeworkDetail,
    onHomeworkDetailChange,
    viewPrevAssignmentId,
    viewNextAssignmentId,
    // CorrectLink,
    // pageQuery,
    handleLeave,
    formLoading,
  } = AssignmentCorrentModel;

  return (
    <div className="assignment-correct">
      <div className="assignment-detail__container">
        <div className="header">
          {!formLoading && viewPrevAssignmentId ? (
            <Button onClick={() => handleLeave(viewPrevAssignmentId)}>
              {/* <CorrectLink params={{ id: viewPrevAssignmentId }} query={{ ...pageQuery }}> */}
              上一个
              {/* </CorrectLink> */}
            </Button>
          ) : (
            <div />
          )}
          <span className="student-name">学员姓名：{formLoading ? '加载中... ' : studentName}</span>
          {!formLoading && viewNextAssignmentId ? (
            <Button onClick={() => handleLeave(viewNextAssignmentId)}>
              {/* <CorrectLink params={{ id: viewNextAssignmentId }} query={{ ...pageQuery }}> */}
              下一个
              {/* </CorrectLink> */}
            </Button>
          ) : (
            <div />
          )}
        </div>
        <div className="homework-detail">
          <Collapse
            activeKey={showHomeworkDetail ? homeworkDetailPanelKey : ''}
            onChange={(v) => {
              const [, panelValue] = v;
              onHomeworkDetailChange(panelValue);
            }}
            bordered={false}
          >
            <Collapse.Panel
              key={homeworkDetailPanelKey}
              title={
                <div className="homework-detail__header">
                  <h2>{homeworkTitle}</h2>
                  <span className="operation">
                    {showHomeworkDetail ? (
                      <span className="fold">
                        收起
                        <Icon type="up" />
                      </span>
                    ) : (
                      <span className="unfold">
                        展开作业内容
                        <Icon type="down" />
                      </span>
                    )}
                  </span>
                </div>
              }
              panelKey={homeworkDetailPanelKey}
              showArrow={false}
              onChange={() => {}}
              bordered={false}
            >
              <HomeworkDetail />
            </Collapse.Panel>
          </Collapse>
          <StudentAnswer />
        </div>
      </div>
      <div className="correct__container">
        <CorrectField />
      </div>
    </div>
  );
};

export default createBlock({
  root: AssignmentCorrect,
  model,
});
