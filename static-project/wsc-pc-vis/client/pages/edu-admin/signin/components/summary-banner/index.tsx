import React from 'react';

import './styles.scss';

export interface ISummaryItem {
  label: string;
  prefixIcon: string;
  summary: number;
}
interface ISummaryBannerProps {
  title: string;
  summaryData: ISummaryItem[];
}
export const SummaryBanner: React.FC<ISummaryBannerProps> = (props) => {
  const { title, summaryData } = props;

  const summaryContent = React.useMemo(() => {
    return summaryData.map((summary, index) => {
      return (
        <div className="summary-banner__content summary-item" key={index}>
          <div className="summary-banner__content summary-item_head">
            <span className="summary-item__title">{summary.label}</span>
          </div>
          <div className="summary-banner__content summary-item__body">
            {}
          </div>
        </div>
      );
    });
  }, [summaryData]);

  return (
    <div className="summary-banner__container">
      <section className="summary-banner__head">
        <span className="summary-banner__head-title">{title}</span>
      </section>
      <section className="summary-banner__content">
        {summaryData.length ? (
          summaryContent
        ) : (
          <span className="description">没有该条件的统计数据</span>
        )}
      </section>
    </div>
  );
};
