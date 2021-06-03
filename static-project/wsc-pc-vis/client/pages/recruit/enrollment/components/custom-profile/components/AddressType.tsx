import { Cascader, ICascaderItem } from '@zent/compat';
import React, { useEffect, useState, forwardRef, useMemo, ChangeEvent, useCallback } from 'react';
import { Notify, Input } from 'zent';
import get from 'lodash/get';
import slice from 'lodash/slice';

import { IProfileField, DataType } from '../index';
import '../styles/address-type.scss';
import { formatAddress } from '../utils/format-fields';
import getAreaList from '../utils/get-area-list';
// import { ICascaderItem } from 'zent/es/cascader/types';

const TAB = ['省', '市', '区'];

function getAddressArr(address, getSource = false) {
  try {
    // 地址格式是[{code: number, name: string} x 3, street: string]
    if (typeof address === 'string') {
      const originData = JSON.parse(address.replace(/\n/, '\\n') || '[]');
      if (Array.isArray(originData)) {
        const provincePart = slice(originData, 0, 3);
        let streetPart = get(originData, '[3]');
        if (streetPart && streetPart instanceof Object) {
          streetPart = get(streetPart, 'name', streetPart);
        }
        return formatAddress([provincePart as any, streetPart], getSource);
      }
      return formatAddress([[], ''], getSource);
    }
    return formatAddress(address, getSource);
  } catch (err) {
    return [[], ''];
  }
}

const AddressType = forwardRef<any, IProfileField>((props, ref) => {
  const [options, setOptions] = useState<any[]>([]);
  // 这里需要将value: [Array<{code: string, name: string}>], string] -> [string[], stirng]
  // 要不没法被级联组件初始化
  const formattedValues = useMemo(() => {
    const address = props.value;
    return getAddressArr(address);
  }, [props.value]);
  const [province, street] = formattedValues;

  const showError = useMemo(() => (
    props.displayError === undefined
      ? props.isDirty && props.error !== null
      : props.displayError
  ), [props.displayError, props.isDirty, props.error]);
  const helpDesc = useMemo(() => props.helpDesc, [props.helpDesc]);
  const errorCls = useMemo(() => (
    showError && (
      props.required
        ? [
          province.length === 3 ? '' : 'has-error',
          props.dataType === DataType.PROVINCE || street ? '' : 'has-error',
        ]
        : [
          !street || (street && province.length === 3) ? '' : 'has-error',
          props.dataType === DataType.PROVINCE ||
            (province.length === 3 && street) ||
            province.length === 0 ? '' : 'has-error',
        ]
    )
  ), [showError, props.required, props.dataType, province, street]);

  const width = useMemo(() => props.width || '185px', [props.width]);
  const dataType = useMemo(() => props.dataType, [props.dataType]);

  useEffect(() => {
    getAreaList().then(setOptions).catch(() => Notify.error('获取省市区资源出错'));
  }, []);

  const handleProvinceChange = useCallback<(values: ICascaderItem[]) => void>(values => {
    const { onChange, value, dataType } = props;
    if (onChange) {
      const province = values.map(val => ({
        code: val.id,
        name: val.title,
      }));

      // 如果只是省市区，那么value格式为[{code, name} x 3]
      if (dataType === DataType.PROVINCE) {
        onChange([province]);
      } else {
        const originData = getAddressArr(value, true);
        onChange([province, get(originData, '[1]', '')]);
      }
    }
  }, [props]);
  const handleStreetChange = useCallback<(evt: ChangeEvent<HTMLTextAreaElement>) => void>(evt => {
    const { onChange, value } = props;
    if (onChange) {
      const street = evt.target.value;
      const originData = getAddressArr(value, true);
      onChange([get(originData, '[0]', []), street]);
    }
  }, [props]);

  return (
    <div ref={ref} className="zent-form__control-group address-field">
      <div className="zent-form__control-label">
        <label className="zent-form__control-label">
          {props.required && <em className="zent-form__required">*</em>}
          {props.label}
        </label>
      </div>
      <div className="zent-form__controls" style={{ width }}>
        <Cascader
          type="menu"
          title={TAB}
          placeholder={props.placeholder}
          changeOnSelect={false}
          className={errorCls[0]}
          options={options}
          onChange={handleProvinceChange}
          value={formattedValues[0] as string[] || []}
        />
        {showError && errorCls[0] && <p className="zent-form__error-desc">{props.error}</p>}
        {dataType === DataType.ADDRESS ? (
          <Input
            type="textarea"
            maxLength={100}
            width={width}
            className={errorCls[1]}
            placeholder="详细地址"
            onChange={handleStreetChange}
            value={get(formattedValues, '[1]', '')}
          />
        ) : null}
        {dataType === DataType.ADDRESS &&
          showError && errorCls[1] && <p className="zent-form__error-desc">{props.error}</p>}
        {helpDesc && <p className="zent-form__help-desc">{helpDesc}</p>}
      </div>
    </div>
  );
});

export default AddressType;
