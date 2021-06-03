import React, { FC, useMemo, useCallback, ReactNode } from 'react';
import { LayoutGrid, LayoutRow, LayoutCol } from 'zent';

import { ICardContentProps, IContentUnit } from '../types';
import get from 'lodash/get';

const CardContent: FC<ICardContentProps> = (props) => {
  const { className, contentGroup = [], renderContent, rowData, colorSchema } = props;
  const useCustomerRender = useMemo(() => renderContent !== undefined, [renderContent]);
  const span = useMemo(() => (useCustomerRender ? 0 : Math.floor(24 / contentGroup.length)), [
    contentGroup.length,
    useCustomerRender,
  ]);
  const renderContentRow = useCallback<(contentGroup: IContentUnit[]) => ReactNode>(
    (contentGroup) => {
      if (useCustomerRender) {
        return null;
      }
      return contentGroup.map((content, index) => {
        const { label, name, render } = content;
        const curValue = get(rowData, name);
        const renderFunc = render || (() => curValue);
        const currentContent = renderFunc(rowData);
        return (
          <LayoutGrid className="card-content__line" key={`content${index}`}>
            <LayoutRow style={{ color: colorSchema.descriptionColor }}>{label}</LayoutRow>
            <LayoutRow style={{ color: colorSchema.contentColor }}>
              {currentContent || '-'}
            </LayoutRow>
          </LayoutGrid>
        );
      });
    },
    [colorSchema.contentColor, colorSchema.descriptionColor, rowData, useCustomerRender]
  );

  if (renderContent) {
    return <div className={className}>{renderContent(rowData)}</div>;
  }

  return (
    <LayoutGrid className={className}>
      <LayoutRow>
        {contentGroup.map((group, index) => (
          <LayoutCol className="card-content__column" key={`group${index}`} span={span}>
            {renderContentRow(group)}
          </LayoutCol>
        ))}
      </LayoutRow>
    </LayoutGrid>
  );
};

export default CardContent;
