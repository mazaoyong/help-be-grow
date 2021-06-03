import React, { FC, ReactNode, useState, useMemo, useCallback } from 'react';
import { Icon } from 'zent';

const Content: FC<{
  contentData: { label?: string; content: ReactNode }[];
  showCollapse: boolean;
  displayLimitation: number;
  triggerCollapse?(isCollapse: boolean): void;
}> = ({ contentData = [], showCollapse, displayLimitation, triggerCollapse }) => {
  const [isExpand, toggleExpand] = useState(false);

  const handleToggleExpand = useCallback(() => {
    const curExpandStatus = !isExpand;
    toggleExpand(curExpandStatus);
    triggerCollapse && triggerCollapse(curExpandStatus);
  }, [isExpand, triggerCollapse]);

  const displayContentData = useMemo(() => {
    if (showCollapse && displayLimitation > 0 && !isExpand) {
      return contentData.slice(0, displayLimitation);
    }
    return contentData;
  }, [contentData, displayLimitation, isExpand, showCollapse]);

  const isOverLimit = useMemo(() => contentData.length > displayLimitation, [contentData, displayLimitation]);

  return (
    <div className="student-card__content">
      {displayContentData.map((contentItem, index) => {
        const { label, content } = contentItem;
        return (
          <div key={index} title={label} className="student-card__content-line">
            <label>{label || ''}</label>
            <div className="primary">{content}</div>
          </div>
        );
      })}
      {(isOverLimit && showCollapse) && (
        <div className="student-card__content-collapse" onClick={handleToggleExpand}>
          <span>{isExpand ? '收起' : '查看更多'}</span>
          <div className={`icon-${isExpand ? 'expand' : 'collapse'}`}>
            <Icon type="down" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
