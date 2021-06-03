import { createComponent } from '@youzan/tany-vue';

import { Button, Progress } from 'vant';

import './style.scss';

import { detailRoute } from '../../../../router';

const Link = detailRoute.getLinkComponent();

interface IHomeworkCardProps {
  id: number;
  title: string;
  status: number;
  totalNumber: number;
  submitNumber: number;
  handleClick: () => void;
}

function HomeworkCard(props: IHomeworkCardProps) {
  const {
    id,
    title,
    status,
    totalNumber,
    submitNumber,
  } = props;

  return (
    <div class="homework-card">
      <div class="homework-card__content">
        <p class="homework-card__title">{title}</p>
        {
          status === 1
            ? (
              <Link params={{ homeworkId: id }}>
                <Button
                  class="homework-card__button"
                  round
                  plain
                  color="#00B389"
                  size="small"
                >
                  去查看
                </Button>
              </Link>
            )
            : <p class="homework-card__tip">待发布</p>
        }
      </div>
      {
        status === 1 && totalNumber !== 0
          ? (
            <div class="homework-card__process">
              <p><span>{submitNumber} / {totalNumber}</span> 已提交</p>
              <Progress percentage={submitNumber / totalNumber * 100} color="#00B389" showPivot={false} />
            </div>
          )
          : null
      }
    </div>
  );
}

export default createComponent(HomeworkCard, {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 1,
    },
    totalNumber: {
      type: Number,
      default: 0,
    },
    submitNumber: {
      type: Number,
      default: 0,
    },
    handleClick: {
      type: Function,
      default: () => { },
    },
  }
});
