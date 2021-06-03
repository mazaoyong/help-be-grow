import React, { FC, useState, useEffect, useCallback } from 'react';
import AnswerSheet from '../../components/answer-sheet';
import StudentInfo from '../../components/student-info';
import Question from '../../components/question';
import { BlockLoading, Pagination, Notify } from 'zent';
import { WithRouterProps } from 'react-router';
import { getExamResult, getUserAnswerDetail } from '../../api';
import { IExamResult, IViewCellData } from '../../types';
import { DEFAULT_RECORD } from '../../constants';
import get from 'lodash/get';
import './styles.scss';

const Result: FC<WithRouterProps> = props => {
  const { id: examRecordId } = props.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [examDetail, setExamDetail] = useState<IExamResult[]>([]);
  const [examRecord, setExamRecord] = useState<IViewCellData>(DEFAULT_RECORD);

  const [curPage, setCurPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [highlightAnchor, setHighlightAnchor] = useState<string>();
  const pageSize = 20;

  const scrollToAnchor = useCallback((anchorName: string) => {
    if (anchorName) {
      if (parseInt(anchorName)) {
        const pageNo = Math.ceil(parseInt(anchorName) / pageSize);
        if (pageNo !== curPage) {
          setCurPage(pageNo);
          setHighlightAnchor(anchorName);
          return;
        }
      }
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
        anchorElement.className = 'question-container show';
        setTimeout(() => {
          anchorElement!.className = 'question-container';
        }, 1000);
      }
      setHighlightAnchor('');
    }
  }, [curPage, pageSize]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getExamResult({ examRecordId })
        .then(res => {
          const { detail, record } = res;
          setExamDetail(detail);
          setExamRecord(record);
        }),
      getUserAnswerDetail({
        pageRequest: {
          pageNumber: curPage,
          pageSize,
        },
        examRecordId,
      })
        .then(res => {
          setQuestionList(res.content);
          setTotal(res.total);
        }),
    ])
      .catch(err => {
        Notify.error(err || '网络错误');
      })
      .finally(() => {
        setLoading(false);
        if (highlightAnchor) {
          scrollToAnchor(highlightAnchor);
        }
      });
  }, [examRecordId, curPage]);

  const onPageChange = useCallback(options => {
    setCurPage(options.current || 1);
  }, []);

  if (loading) {
    return (
      <BlockLoading loading />
    );
  };

  return (
    <div className="result-container">
      <div className="result-container-aside">
        <StudentInfo
          avatar={get(examRecord, 'userInfo.avatar')}
          name={get(examRecord, 'userInfo.nickName')}
          time={get(examRecord, 'examTime')}
        />
        <AnswerSheet examDetail={examDetail} examRecord={examRecord} scrollToAnchor={scrollToAnchor} />
      </div>
      <div className="result-container-main">
        <div className="question-field">
          {questionList.map((item, index) => {
            const { question, answer } = item;
            return <Question key={index + 1} id={(curPage - 1) * 20 + index + 1} question={question} answer={answer} />;
          })}
        </div>
        <Pagination
          current={curPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Result;
