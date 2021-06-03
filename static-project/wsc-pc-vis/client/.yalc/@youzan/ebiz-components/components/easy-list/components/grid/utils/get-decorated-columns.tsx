import React from 'react';
import get from 'lodash/get';
import { IGridColumn } from 'zent';
import HeaderHelp from '../components/header-help';
import { IEasyGridColumn } from '../../../types/grid';

function defaultFormatter(data: any) {
  return data;
}
export const getDecoratedColumns = (originColumns: IEasyGridColumn[]) => {
  const temp: IGridColumn[] = [];
  let hasLeftFixedCol = false;
  originColumns.forEach((column) => {
    const {
      bodyRender,
      fixed,
      formatter = defaultFormatter,
      headerHelp,
      helpPopPosition,
      name,
      title,
      visible = true,
    } = column;
    if (!hasLeftFixedCol && fixed === 'left') hasLeftFixedCol = true;
    if (visible) {
      const Comp = headerHelp ? (
        <HeaderHelp title={title} headerHelp={headerHelp} position={helpPopPosition} />
      ) : (
        title
      );
      let wrappedBodyRender = bodyRender ? { bodyRender } : {};
      if (!bodyRender) {
        wrappedBodyRender = {
          bodyRender(data: any) {
            const originData = name ? get(data, name, '-') : data;
            if (originData !== '-') {
              return formatter(originData);
            }
            return originData;
          },
        };
      }
      temp.push({
        ...column,
        title: Comp,
        ...wrappedBodyRender,
      });
    }
  });
  return {
    columns: temp,
    params: {
      hasLeftFixedCol,
    },
  };
};
