import React, { FC } from 'react';
import { numberWithCommas } from './utils';

import './styles.scss';

interface ISummaryCardsConfig {
  title: string;
  value: number | string;
}

interface ISummaryCardListProps {
  config: ISummaryCardsConfig[];
}

const Card: FC<ISummaryCardsConfig> = ({ title, value }) => {
  return (
    <div className="summary-card__card">
      <span className="title">{title}</span>
      <span className="value">
        {typeof value === 'number'
          ? numberWithCommas(value)
          : value
        }
      </span>
    </div>
  );
};

const SummaryCardList: FC<ISummaryCardListProps> = ({ config = [] }) => {
  return (
    <div className="summary-card__list">
      {config.map(card => (
        <Card key={card.title} title={card.title} value={card.value || 0} />
      ))}
    </div>
  );
};

export default SummaryCardList;
