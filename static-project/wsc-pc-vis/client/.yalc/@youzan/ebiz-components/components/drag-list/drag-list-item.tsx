import React from 'react';
import get from 'lodash/get';
import Icon from '../icon';

import { IDragItemProps } from './types';

const DragListItem: React.FC<IDragItemProps> = (props) => {
  const {
    icon,
    columns,
    orderId,
    iconSize,
    iconColor,
    datasets = {},
    disabledAnchor,
    noAnchor = false,
  } = props;

  const Anchor = React.useMemo(() => <Icon type={icon} color={iconColor} size={iconSize} />, [
    icon,
    iconColor,
    iconSize,
  ]);

  const DisabledAnchor = React.useMemo(() => (disabledAnchor ? disabledAnchor : null), [
    disabledAnchor,
  ]);

  return (
    <tr data-sortable-id={orderId} className="ebiz-drag-list__content-line">
      {noAnchor ? (
        <td>{DisabledAnchor}</td>
      ) : (
        <td className="ebiz-drag-list__content-dragAnchor">{Anchor}</td>
      )}
      {columns.map((col, index) => {
        let NODE: React.ReactNode = null;
        const { bodyRender, name, defaultText = '-' } = col;
        if (bodyRender) {
          NODE = bodyRender(datasets);
        } else {
          if (name) {
            if (/[.[]]/.test(name)) {
              NODE = get(datasets, name);
            } else {
              NODE = datasets[name];
            }
          } else {
            throw new Error('columns需要指定name或者bodyRender');
          }
        }

        return (
          <td
            key={`content[${index}]`}
            className="ebiz-drag-list__content-item"
            style={{ textAlign: col.textAlign || 'left' }}
          >
            <div className="ebiz-drag-list__content-item ebiz-drag-content">
              {NODE || defaultText}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default DragListItem;
