import { image as VanImage, cell as VanCell, Tag as VanTag } from 'vant';
import {
  IAssignmentPageDTO,
} from 'definitions/api/owl/pc/AssignmentFacade/findHomeworkAssignmentPage';
import { reviewRoute } from '@/pages/supv/homework/router';
import './style';
import { DEFAULT_AVATAR, SCORE_RULE } from 'domain/supv/homework/constants';
import { format } from 'date-fns';
import Homework from 'domain/supv/homework/entities/Homework';

const Link = reviewRoute.getLinkComponent();

export function StudentCard(
  model: IAssignmentPageDTO,
  homework: Homework,
  isReviewed = false,
  setReviewPageData: () => void,
) {
  let isPass = false;
  let isNotPass = false;
  if (homework.isNumberScore) {
    if ((homework.reviewSettings.scoreRule === SCORE_RULE.TEN &&
      Number(model.score) >= 6
    ) || (
      homework.reviewSettings.scoreRule === SCORE_RULE.HUNDREDS &&
      Number(model.score) >= 60
    )) {
      isPass = true;
    } else {
      isNotPass = true;
    }
  }

  return (
    <div key={model.assignmentId} class="student-card">
      <VanImage
        width="48"
        height="48"
        round
        src={model.studentDTO?.avatar || DEFAULT_AVATAR}
      />

      <Link
        params={{ assignmentId: model.assignmentId }}
        props={{
          onClick: () => setReviewPageData(),
        }}
      >
        <VanCell
          center
          isLink
          title={model.studentDTO?.name || '匿名用户'}
          value={
            isReviewed
              ? `${homework.isNumberScore ? `${model.score} 分` : model.score}`
              : '去批阅'
          }
          label={`${isReviewed ? '批阅于' : '提交于'} ${format(Number(isReviewed ? model.reviewTime : model.submitTime), 'MM.DD HH:mm')}`}
          valueClass={
            isPass ? 'student-card__score--pass' : isNotPass ? 'student-card__score--nopass' : ''
          }
        >
          {
            model.studentStatus === 2
              ? (
                <template slot="title">
                  <span class="custom-title">{model.studentDTO?.name || '匿名用户'}</span>
                  <VanTag plain>已退出作业本</VanTag>
                </template>
              )
              : null
          }
        </VanCell>
      </Link>
    </div>
  );
};
