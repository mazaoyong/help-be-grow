import { createComponent, ModelOf } from '@youzan/tany-vue';
import { useAppModel } from '../../../../App.model';
import { detailRoute } from '../../../../router';

import { Button as VanButton } from 'vant';
import { getThemeColor } from '@youzan/vue-theme-plugin';

import './style.scss';
import {
  NoticeBar as VanNoticeBar
} from 'vant';
import { format } from 'date-fns';

export interface IHomeworkCardProps {
  /** 作业标题 */
  title: string;
  /** 作业别称 */
  homeworkAlias: string;
  /** 作业截止时间 */
  deadline?: string;
  isOvertime: boolean;
  assignmentId: number;
  kdtId: number;
}

function HomeworkCardModel(props: IHomeworkCardProps) {
  const {
    currentStudentInfo
  } = useAppModel();

  const handleClick = (assignmentId: number) => {
    return () => {
      detailRoute.redirectTo({
        query: {
          assignmentId,
          studentId: currentStudentInfo.value?.id,
          kdt_id: props.kdtId
        }
      })
    }
  }

  return {
    props,
    handleClick
  };
}


function HomeworkCard(model: ModelOf<typeof HomeworkCardModel>) {
  const {
    props,
    handleClick
  } = model;
  const {
    title,
    deadline,
    isOvertime,
    assignmentId,
  } = props;

  return (
    <div class="homework-card">
      {deadline && !isOvertime ? (
        <VanNoticeBar
          class="homework-card__notice"
          leftIcon="underway"
          text={`请于 ${format(deadline!, "YYYY-MM-DD HH:mm")} 前提交作业`}
        />
      ) : null}
      <div
        class="homework-card__main"
        independent={deadline === undefined}
        onClick={handleClick(assignmentId)}
      >
        <div class="homework-card__main__left">
          <p class="homework-card__title">{title}</p>
        </div>
        <div class="homework-card__main__right">
          {isOvertime ? (
            <span class="homework-card__overtime">已截止</span>
          ) : (
            <VanButton
              class="homework-card__button"
              color={getThemeColor('main')}
              round
              size="small"
            >
              去完成
            </VanButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default createComponent(HomeworkCard, {
  model: HomeworkCardModel
});