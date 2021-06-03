import { React, createBlock, ModelOf } from '@youzan/tany-react';
import { BlockLoading } from 'zent';
import useCorrectPageModel from '../../models/correct-page';
import { renderElement } from '../../utils';
import { RenderType } from '../../types';
import './styles.scss';

const homeworkDetailModel = () => {
  const { homework, formLoading } = useCorrectPageModel();
  const detail = homework?.detail;

  const detailElement = detail?.map((item, index) => {
    return renderElement(item, index, RenderType.FORM);
  });

  return {
    detailElement,
    formLoading,
  };
};

const HomeworkDetail = (model: ModelOf<typeof homeworkDetailModel>) => {
  const { detailElement, formLoading } = model;

  return (
    <div className="homework-detail__container">
      {!formLoading ? detailElement : <BlockLoading loading={true} height={300} />}
    </div>
  );
};

export default createBlock({
  root: HomeworkDetail,
  model: homeworkDetailModel,
});
