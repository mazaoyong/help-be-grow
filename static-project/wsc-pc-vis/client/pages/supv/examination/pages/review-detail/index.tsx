import React, { useState, FC, useEffect, useCallback, useRef } from 'react';
import { hashHistory } from 'react-router';
import { hot } from 'react-hot-loader';
import { Button, Notify, Sweetalert, BlockLoading, Affix } from 'zent';

import AnswerPart from './answer-part';

import { SCORE_MULTIPLIER } from '../../constants';

import { safeAdd, safeMul } from '../../utils';

import {
  getReviewDetail,
  submitReview,
  IReviewListQuery,
  ISubmitReviewPayload,
  getReviewIdByOption
} from '../../api';

import { IBasicInfo, IStatistics } from './types';

import OverviewCard from './overview-card';

import './index.scss';

/** 页面接受的路由参数 */
interface IReviewDetailPageProps {
  /** 答卷所属的考试的 id */
  examTemplateId: string;
  /** 答卷本身的 id */
  answerPaperId: string;
}

/** 页面组件的 Props */
interface IReviewDetailWrapperProps {
  /** 即 react router 注入的 params */
  params: IReviewDetailPageProps
}

const INIT_STATISTICS: IStatistics = {
  answeredCount: 0,
  correctCount: 0,
  unansweredCount: 0,
  faultCount: 0,
  totalScore: 0
};

const ReviewDetailPage: FC<IReviewDetailPageProps> = ({ answerPaperId, examTemplateId }) => {
  // 底部按钮的加载中状态
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(true);

  // 答卷基本信息
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({
    title: '-',
    startTime: 0,
    submitTime: 0,
    username: '-'
  });

  /**  是否更改过评阅的数据（当更改过评阅的数据（得分或评语）后，点取消的时候要进行弹窗提示 ） */
  const hasChangedReviewData = useRef<boolean>(false);

  // 【客观题】题目列表
  const [objectiveQuestionAnswers, setObjectiveQuestionAnswers] = useState([]);
  // 【客观题】答题情况统计(答对，答错，漏答，总分)
  const [objectiveQuestionStatistics, setObjectiveQuestionStatistics] = useState<IStatistics>(INIT_STATISTICS);

  // 【主观题】题目列表
  const [subjectiveQuestionAnswers, setSubjectiveQuestionAnswers] = useState([]);
  // 【主观题】总分
  const [subjectiveQuestionScore, setSubjectiveQuestionScore] = useState(0);
  // 【主观题】题目 id 为 Key 的评阅信息 Map，用于汇总分数、整理提交数据。
  const reviewMap = useRef(Object.create(null));
  // 【主观题】答题情况统计(答对，答错，漏答，总分)
  const [subjectiveQuestionStatistics, setsubjectiveQuestionStatistics] = useState<IStatistics>(INIT_STATISTICS);

  // 获取答卷详情
  useEffect(() => {
    getReviewDetail({ answerPaperId: Number(answerPaperId) }).then(resp => {
      const {
        startTime = 0,
        submitTime = 0,
        title = '',
        examUser: { name: username = '-' },
        objectiveQuestionAnswers = {},
        subjectiveQuestionAnswers = {},
      } = resp;

      // 设置考试基本信息
      setBasicInfo({
        title,
        startTime,
        submitTime,
        username
      });

      // 【客观题】设置数据
      const [objStats, objAnswers] = parseAnswersData(objectiveQuestionAnswers);
      setObjectiveQuestionStatistics(objStats);
      setObjectiveQuestionAnswers(objAnswers);

      // 【主观题】设置数据
      const [subjStats, subjAnswers] = parseAnswersData(subjectiveQuestionAnswers);
      setsubjectiveQuestionStatistics(subjStats);
      setSubjectiveQuestionAnswers(subjAnswers);
      // 【主观题】总分会实时变化，所以单独设置一个总分状态
      setSubjectiveQuestionScore(subjStats.totalScore);

      // 【主观题】提取并设置评阅数据，用于页面表单回填
      reviewMap.current = subjAnswers.reduce((_map, item) => {
        const {
          review, question: { questionId }
        } = item;
        // review 为 null 表示没有评阅数据，设置为初始数据
        if (!review) {
          _map[questionId] = {
            score: 0,
            questionId,
            comment: ''
          };
          return _map;
        }
        const {
          score = 0,
          comment = ''
        } = review;
        _map[questionId] = {
          // 后端返回分数为整数，需要除以 100
          score: score / SCORE_MULTIPLIER,
          comment,
          questionId
        };
        return _map;
      },
      Object.create(null)
      );
    }).catch((msg) => {
      Notify.error(msg);
    }).finally(() => {
      setLoading(false);
      setFetching(false);
    });
  }, [answerPaperId]);

  // 评阅数据（每一题的评分、分数）变化的回调
  const handleReviewChange = useCallback((questionId, payload) => {
    const singleReview = reviewMap.current[questionId];
    reviewMap.current[questionId] = {
      ...singleReview,
      ...payload,
    };
    // 如果分数变化的话，那还要计算下当下的主观题总分（所有题目的分数相加）
    if (payload.score) {
      // @ts-ignore
      const totalScore: number = Object.values(reviewMap.current).reduce(
        (total, item) => {
        // @ts-ignore
          return safeAdd(total, item.score);
        },
        0
      );
      // 更新 State
      setSubjectiveQuestionScore(totalScore);
    }
    // 需求：有评阅数据或改动过评阅数据，点取消按钮时需提示
    // 使用变量进行标记，调用过回调函数就设为 true
    if (!hasChangedReviewData.current) {
      hasChangedReviewData.current = true;
    }
  }, [reviewMap]);

  // 点击取消按钮的回调
  const handleCancelReview = useCallback(() => {
    setLoading(true);
    const listPageUrl = `/review/${examTemplateId}`;
    // 需求：有评阅数据或改动过评阅数据，点取消按钮时需提示
    if (hasChangedReviewData.current) {
      Sweetalert.confirm({
        content: '退出后将丢失批阅内容，确定退出吗？',
        onConfirm: () => { hashHistory.push(listPageUrl); },
        onCancel: () => {
          setLoading(false);
        }
      });
      return;
    }
    hashHistory.push(listPageUrl);
  }, [examTemplateId]);

  const handleSubmitReview = useCallback((withNext = false) => {
    setLoading(true);

    // 生成提交批阅接口所需的数据
    const payload : ISubmitReviewPayload = {
      answerPaperId: Number(answerPaperId),
      reviews: Object.values(reviewMap.current).map((item) => {
        // @ts-ignore
        const { comment, score, questionId } = item;
        return {
          comment,
          // @TODO: 测试
          score: safeMul(score, SCORE_MULTIPLIER),
          questionId
        };
      })
    };

    submitReview(payload).then(isSuccess => {
      if (isSuccess) {
        Notify.success('当前考卷已保存');
        hasChangedReviewData.current = false;
        // 提交并批阅下一个
        if (withNext) {
          // 查询下一个答卷
          const data:IReviewListQuery = {
            answerPaperId: Number(answerPaperId),
            option: {
              queryNextNotReview: true
            }
          };
          return getReviewIdByOption(data).then(resp => {
            if (!resp) {
              Notify.info('没有未批阅的学员了');
              return;
            }
            const { answerPaperId: nextAnswerPaperId } = resp;
            hashHistory.push(`/review/${examTemplateId}/detail/${nextAnswerPaperId}`);
          });
        } else {
          hashHistory.push(`/review/${examTemplateId}`);
        }
      } else {
        Notify.error('批阅失败');
      }
    }).catch((msg) => {
      Notify.error(msg || '网络错误');
    }).finally(() => {
      setLoading(false);
    });
  }, [answerPaperId, examTemplateId]);

  return (<main className="review-detail-container">
    <section className="review-detail__answers">
      {fetching ? <BlockLoading loading />
        : (<div className="review-detail__answers--parts-container">
          {/* 客观题板块 */}
          <AnswerPart
            score={objectiveQuestionStatistics.totalScore}
            title="非问答题 答题情况"
            subtitle="此部分已由系统自动批阅完成"
            defaultExpand={subjectiveQuestionAnswers.length === 0}
            statistics={[
              {
                text: '答对',
                value: objectiveQuestionStatistics.correctCount,
                type: 'correct'
              },
              {
                text: '答错',
                value: objectiveQuestionStatistics.faultCount,
                type: 'wrong'
              },
              {
                text: '漏答',
                value: objectiveQuestionStatistics.unansweredCount
              },
            ]}
            questions={objectiveQuestionAnswers}
          />
          {/* 主观题板块 */}
          <AnswerPart
            score={subjectiveQuestionScore}
            title="问答题 批阅情况"
            defaultExpand={true}
            statistics={[
              {
                text: '已答',
                value: subjectiveQuestionStatistics.answeredCount,
                type: 'correct'
              },
              {
                text: '漏答',
                value: subjectiveQuestionStatistics.unansweredCount,
                type: 'wrong'
              },
            ]}
            questions={subjectiveQuestionAnswers}
            onQuestionChange={handleReviewChange}
          />
        </div>)
      }
      {/** 页脚的三个操作按钮 */}
      <footer className="review-detail__answers--footer">
        <div className="review-detail__answers--footer-content">
          <Button loading={loading} onClick={handleCancelReview}>取消</Button>
          <Button
            disabled={subjectiveQuestionAnswers.length === 0}
            loading={loading}
            onClick={() => { handleSubmitReview(); }}>
           完成批阅
          </Button>
          <Button
            disabled={subjectiveQuestionAnswers.length === 0}
            loading={loading}
            onClick={() => { handleSubmitReview(true); }}
            type="primary">
           提交并批阅下一学员
          </Button>
        </div>
      </footer>
    </section>
    {/** 右侧的基本信息卡片 */}
    <aside className="review-detail__aside">
      <Affix offsetTop={16}>
        <OverviewCard
          totalScore={safeAdd(subjectiveQuestionScore, objectiveQuestionStatistics.totalScore)}
          title={basicInfo.title}
          startTime={basicInfo.startTime}
          submitTime={basicInfo.submitTime}
          username={basicInfo.username}
        />
      </Affix>
    </aside>
  </main>);
};

// Wrapper 的作用是当路由参数改变时刷新页面
export default hot(module)(
  // Hash 路由当参数改变（ push()、location.assign() 或地址栏更改 url 、点击浏览器前进后退按钮）的时候 \
  // 页面组件并不会销毁再创建，而是更新 props，这会导致组件中某些状态还是上一个页面中的，导致数据错乱 \
  // （如这个页面中使用 useRef 的存储的评阅数据，以及是否更新过评阅数据的标记变量等，而且由于答卷题目都是一样的，\
  //    仅答案不同，会导致子组件(question-wrapper)中储存的局部状态不变。）
  //  解决方案 1: 路由改变会触发 useEffect 请求数据，此时重置这些状态
  //  解决方案 2: 包装下页面组件，利用 React 的 key props 强制更新
  function ReviewDetailPageWrapper({ params }:IReviewDetailWrapperProps) {
    const { answerPaperId, examTemplateId } = params;
    return (
      <ReviewDetailPage
        key={answerPaperId}
        answerPaperId={answerPaperId}
        examTemplateId={examTemplateId}
      />
    );
  }
);

// 解析后端返回的数据，返回统计信息和题目列表
function parseAnswersData(data) {
  const {
    correctCount = 0,
    unansweredCount = 0,
    faultCount = 0,
    totalScore = 0,
    answeredCount = 0,
    questionAnswers = [],
  } = data;

  return [
    {
      answeredCount,
      correctCount,
      unansweredCount,
      faultCount,
      totalScore: totalScore / SCORE_MULTIPLIER,
    },
    questionAnswers,
  ];
}
