import React from 'react';

interface IProps {
  prefixcls: string;
  label: string;
  amount: {
    integer: number | string;
    decimal: number | string;
  };
  className?: string;
}

const AmountDisplay: React.FC<IProps> = ({ prefixcls, label, amount, className = '' }) => {
  return (
    <div className={`${prefixcls}-amount-display ${className}`}>
      <label>{label}：</label> ￥
      <label className='integer-label'>{amount.integer}.</label>
      <label className='decimal-label'>{amount.decimal}</label>
    </div>
  );
};

export default AmountDisplay;
