import { React, createBlock, ModelOf } from '@youzan/tany-react';

import useWorkbookSummaryModel from '../../models/workbook-summary';
import { summaryTitleMap } from '../../../../constants';

import './styles.scss';

export const SummaryModel = () => {
  const {
    summaryData,
  } = useWorkbookSummaryModel();

  return {
    summaryData,
  };
};

type ModelType = ModelOf<typeof SummaryModel>;

const WorkbookSummary = (SummaryModel: ModelType) => {
  const { summaryData } = SummaryModel;

  return (
    <div className="workbook-manage__summary">
      <h2>{summaryData?.title || ''}</h2>
      <div className="statistics-container">
        {Object.keys(summaryTitleMap)
          .map(item => (
            <div key={item} className="statistics-item">
              <p className="statistics-title">{summaryTitleMap[item]}</p>
              <p className="statistics-value">{summaryData[item] || '0'}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default createBlock({
  model: SummaryModel,
  root: WorkbookSummary,
});
