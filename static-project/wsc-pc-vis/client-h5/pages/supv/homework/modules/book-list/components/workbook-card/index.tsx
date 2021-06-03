import { Icon } from 'vant';
import { createComponent } from '@youzan/tany-vue';
import { ImgWrap } from '@youzan/vis-ui';
import { listRoute } from '../../../../router';

import './style';

const Link = listRoute.getLinkComponent();

interface IWorkbookCardProps {
  id: number;
  title: string;
  homeworkNumber: number;
  toCorrectNumber: number;
  setCurrentBookTitle: (title: string) => void;
}

function WorkbookCard(props: IWorkbookCardProps) {
  const {
    id,
    title,
    homeworkNumber,
    toCorrectNumber,
    setCurrentBookTitle,
  } = props;

  return (
    <Link params={{ workbookId: id }} props={{ onClick: () => setCurrentBookTitle(title) }}>
      <div class="workbook-card">
        <ImgWrap
          width="46px"
          height="60px"
          src="https://b.yzcdn.cn/public_files/34eb4e393e6af60434feeec88aa335e9.png"
        />
        <div class="workbook-card__content">
          <div class="workbook-card__content__main">
            <p class="workbook-card__title">{ title }</p>
            <div class="workbook-card__count">
              <p>作业数：{homeworkNumber} </p>
              <div class="workbook-card__split"></div>
              <p> 待批阅：{toCorrectNumber}</p>
            </div>
          </div>
          <Icon name="arrow" />
        </div>
      </div>
    </Link>
  );
}

export default createComponent(WorkbookCard);
