import React from 'react';
import { BlockLoading } from 'zent';
import { Icon } from '@youzan/ebiz-components';
import './styles.scss';

export interface ISummaryDataItem {
  icon: string;
  iconColor?: string;
  iconSize?: string;
  title: string;
  content: string;
}
interface ISummaryInfoProps {
  title: string;
  loading?: boolean;
  infoList: ISummaryDataItem[];
  renderContent?(data: ISummaryDataItem): React.ReactNode;
}
export const SummaryInfoBlock: React.FC<ISummaryInfoProps> = (props) => {
  const { title, infoList, renderContent, loading = false } = props;
  const renderer = React.useCallback(
    (info: ISummaryDataItem, idx: number) => {
      return (
        <div className="info-item" key={idx}>
          {renderContent !== undefined ? (
            renderContent(info)
          ) : (
            <>
              <div className="header">
                <div className="icon">
                  <Icon
                    type={info.icon as any}
                    size={info.iconSize || '18px'}
                    color={info.iconColor || '#275dcc'}
                  />
                </div>
                <div className="title">{info.title}</div>
              </div>
              <div className="content">{info.content}</div>
            </>
          )}
        </div>
      );
    },
    [renderContent],
  );
  return (
    <BlockLoading loading={loading} className="summary-info-block">
      <p className="info-title description">{title}</p>
      <div className="info-list">{infoList.map(renderer)}</div>
    </BlockLoading>
  );
};
