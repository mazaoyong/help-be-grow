import React from 'react';
import { Pop, Icon } from 'zent';

import { IDragListBoxProps } from './types';

const DragListHeaderWithRef: React.FC<IDragListBoxProps> = (props) => {
  const { columns, className } = props;
  const tableRef = React.useRef<HTMLTableElement|null>(null);

  return (
    <div className={className}>
      <table ref={tableRef}>
        <colgroup>
          <col style={{ width: '1rem' }} />
          {columns.map((col, index) => {
            const width = col.width || undefined;
            const inlineStyles: React.CSSProperties = {
              width: width || 'auto',
              minWidth: width || 'auto',
            };
            return <col key={`col[${col.name || index}]`} style={inlineStyles} />;
          })}
        </colgroup>
        <thead role="header">
          <tr className="ebiz-drag-list__content-line">
            <th style={{ width: '1rem' }} />
            {columns.map((col, index) => {
              const { title, helpDesc, name } = col;
              let HelpNode = null;
              if (helpDesc) {
                HelpNode = (
                  <Pop trigger="hover" content={helpDesc}>
                    <Icon style={{ color: '#C8C9CC', fontSize: '16px' }} type="help-circle" />
                  </Pop>
                );
              }
              return (
                <th
                  key={`header[${name || index}]`}
                  className="ebiz-drag-list__header-item"
                  style={{ textAlign: col.textAlign || 'left' }}
                >
                  <div className="ebiz-drag-list__content-item ebiz-drag-content">
                    {HelpNode ? (
                      <div className="ebiz-drag-list__with-help">
                        <span>{title}</span>
                        <span>{HelpNode}</span>
                      </div>
                    ) : (
                      title
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default DragListHeaderWithRef;
