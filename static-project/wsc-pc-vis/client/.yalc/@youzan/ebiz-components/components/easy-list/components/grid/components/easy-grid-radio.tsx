import React from 'react';
import get from 'lodash/get';
import { IGridColumn, Radio } from 'zent';
import { RadioContext } from '../utils/radio-context';

interface IEasyGridRadioProps {
  rowKey: any;
  row: any;
}
export const EasyGridRadio: React.FC<IEasyGridRadioProps> = (props) => {
  const { rowKey, row } = props;
  const radioCtx = React.useContext(RadioContext);
  const identityId = React.useMemo(() => get(row, rowKey || /* istanbul ignore next */ 'id'), [
    row,
    rowKey,
  ]);

  const isChecked = React.useMemo(() => identityId === radioCtx.selected, [
    identityId,
    radioCtx.selected,
  ]);
  const isDisabled = React.useMemo(() => get(radioCtx.getRadioProps(row), 'disabled', false), [
    radioCtx,
    row,
  ]);

  const handleChange = React.useCallback(() => {
    radioCtx.setSelect(identityId, row);
  }, [radioCtx, identityId, row]);
  return (
    <label className="easy-grid__radio" data-testid={row[rowKey]}>
      <Radio checked={isChecked} disabled={isDisabled} onChange={handleChange} />
    </label>
  );
};

interface IGetRadioConfigParams {
  rowKey: string;
  isFixed: boolean;
}
export const getRadioConfig = (params: IGetRadioConfigParams) => {
  const { isFixed, rowKey } = params;
  const fixedProps = isFixed ? { fixed: 'left' } : /* istanbul ignore next */ {};
  return {
    name: '__internal_grid_radio__',
    title: <div className="easy-grid__radio-title" />,
    width: '44px',
    bodyRender(rowData) {
      return <EasyGridRadio row={rowData} rowKey={rowKey} />;
    },
    ...fixedProps,
  } as IGridColumn;
};
