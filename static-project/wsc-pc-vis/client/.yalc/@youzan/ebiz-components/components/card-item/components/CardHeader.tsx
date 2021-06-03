import React, { useMemo, FC } from 'react';
import { LayoutRow, LayoutCol, LayoutGrid } from 'zent';
import get from 'lodash/get';

import { IColorSchema, ICardHeaderProps } from '../types';

function getTypicalColor(colorSchema: IColorSchema, name: keyof IColorSchema) {
  const color = get(colorSchema, name);
  if (color) {
    return { color };
  }
  return undefined;
}

const CardHeader: FC<ICardHeaderProps> = (props) => {
  const [titleStyle, subtitleStyle] = useMemo(
    () => [
      getTypicalColor(props.colorSchema, 'primaryColor'),
      getTypicalColor(props.colorSchema, 'secondaryColor'),
    ],
    [props.colorSchema]
  );

  const leftPartSpan = useMemo(() => (props.ratio || 0.5) * 24, [props.ratio]);

  return (
    <LayoutGrid className={props.headerClassName}>
      <LayoutRow>
        <LayoutCol span={leftPartSpan}>
          <div className="card-item-header-title" style={titleStyle}>
            {props.title}
          </div>
          {props.subtitle && (
            <div className="card-item-header-subtitle" style={subtitleStyle}>
              {props.subtitle}
            </div>
          )}
        </LayoutCol>
        <LayoutCol className="card-item-header-operations" span={24 - leftPartSpan}>
          {props.operators}
        </LayoutCol>
      </LayoutRow>
    </LayoutGrid>
  );
};

export default CardHeader;
