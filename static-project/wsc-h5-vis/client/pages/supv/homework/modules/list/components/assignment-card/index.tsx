import { createComponent, ModelOf } from '@youzan/tany-vue';
import { useAppModel } from '../../../../App.model';
import { assignmentRoute } from '../../../../router'

import { Icon as VanIcon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import './style.scss';

export interface IAssignmentCard {
  /** 学员作业Id */
  assignmentId: number;
  /** 作业标题 */
  title: string;
  /** 作业分数 */
  score: string;
  /** 是否是优秀作业 */
  isExcellent: boolean;
  kdtId: number;
}

function AssignmentCardModel(props: IAssignmentCard) {
  const {
    currentStudentInfo
  } = useAppModel();

  const handleClick = (assignmentId: number) => {
    return () => {
      assignmentRoute.redirectTo({
        query: {
          assignmentId,
          studentId: currentStudentInfo.value?.id,
          kdt_id: props.kdtId,
        }
      })
    }
  }

  return {
    props,
    handleClick
  };
}


function AssignmentCard(model: ModelOf<typeof AssignmentCardModel>) {
  const {
    props,
    handleClick
  } = model;
  const {
    assignmentId,
    title,
    score,
    isExcellent,
  } = props;

  return (
    <div class="assignment-card" onClick={ handleClick(assignmentId) }>
      <div class="assignment-card__main">
        <div class="assignment-card__main__left">
            <p class="assignment-card__title">{ title }</p>
        </div>
        <div class="assignment-card__main__right">
          <span class="assignment-card__score">{ score }</span>
          <VanIcon name="arrow" />
        </div>
      </div>
      {
        isExcellent
        ? (<ImgWrap
            class="assignment-card__excellent"
            props={{
              width: '100%',
              height: '100%',
              src: 'https://b.yzcdn.cn/public_files/2bc743ecbb6f0af4bdf1031ac2584693.gif',
              alt: '优秀作业',
              disableLazyload: true
            }}
          />
        )
        : null
      }
    </div>
  )
}

export default createComponent(AssignmentCard, {
  model: AssignmentCardModel
});