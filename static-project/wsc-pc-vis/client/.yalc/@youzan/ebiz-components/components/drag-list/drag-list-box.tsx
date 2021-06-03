import React from 'react';

import { IDragListBoxProps } from './types';

const DragListBoxWithRef: React.FC<IDragListBoxProps> = (props) => {
  const { columns, children, className } = props;

  return (
    <div className={className}>
      <div className="ebiz-drag-list__content-container">
        <table>
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
          {children}
        </table>
      </div>
    </div>
  );
};

export default DragListBoxWithRef;
