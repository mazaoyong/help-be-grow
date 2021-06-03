import { Cascader, ICascaderItem } from '@zent/compat';
import React, { useEffect, useState, useMemo, ChangeEvent, useCallback, FC } from 'react';
import { Notify, Input } from 'zent';
import get from 'lodash/get';
import slice from 'lodash/slice';

import { IProfileField, DataType } from '../types';
import '../styles/address-type.scss';
import getAreaList from '../utils/get-area-list';
// import { ICascaderItem } from 'zent/es/cascader/types';

const TAB = ['省', '市', '区'];

function getAddressArr(
  address: any,
): {
    provincePart: Array<{ code: string | number; name: string }>;
    streetPart: { code: string | number; name: string };
  } {
  try {
    // 地址格式是[{code: number, name: string} x 3, street: string]
    if (typeof address === 'string') {
      // 处理换行
      const originData = JSON.parse(address.replace(/\n/, '\\n') || '[]');
      if (Array.isArray(originData)) {
        const provincePart = slice(originData, 0, 3);
        let streetPart = get(originData, '[3]');
        if (!streetPart || typeof streetPart === 'string') {
          streetPart = {
            code: '0',
            name: streetPart,
          };
        }
        return {
          provincePart,
          streetPart,
        };
      }
    }
    const legallyAddress = address as Array<{ code: number | string; name: string }>;
    const provincePart = slice(legallyAddress, 0, 3);
    const streetPart = slice(legallyAddress, -1)[0] || {};
    return {
      provincePart,
      // @ts-ignore
      streetPart,
    };
  } catch (err) {
    return {
      provincePart: [],
      streetPart: { code: 0, name: '' },
    };
  }
}

const AddressType: FC<IProfileField & Record<string, any>> = props => {
  const { dataType, value, onChange } = props;
  const [options, setOptions] = useState<any[]>([]);
  // 这里需要将value: [Array<{code: string, name: string}>], string] -> [string[], stirng]
  // 要不没法被级联组件初始化
  const { provincePart, streetPart } = useMemo(() => getAddressArr(value), [value]);

  const width = useMemo(() => props.width || '185px', [props.width]);

  useEffect(() => {
    getAreaList()
      .then(setOptions)
      .catch(() => Notify.error('获取省市区资源出错'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProvinceChange = useCallback(
    (values: ICascaderItem[]) => {
      const province = values.map(val => ({
        code: val.id,
        name: val.title,
      }));

      // 如果只是省市区，那么value格式为[{code, name} x 3]
      if (dataType === DataType.PROVINCE) {
        onChange && onChange(province);
      } else {
        onChange && onChange(province.concat(streetPart));
      }
    },
    [dataType, onChange, streetPart],
  );
  const handleStreetChange = useCallback<(evt: ChangeEvent<HTMLTextAreaElement>) => void>(
    evt => {
      const street = evt.target.value;
      onChange && onChange(provincePart.concat({ code: '0', name: street }));
    },
  [onChange, provincePart],
  );

  return (
    <div className="address-field">
      <Cascader
        type="menu"
        title={TAB}
        placeholder={props.placeholder}
        changeOnSelect={false}
        options={options}
        onChange={handleProvinceChange}
        value={provincePart.map(province => province.code)}
      />
      {dataType === DataType.ADDRESS ? (
        <Input
          type="textarea"
          maxLength={100}
          width={width}
          placeholder="详细地址"
          onChange={handleStreetChange}
          value={streetPart.name}
        />
      ) : null}
    </div>
  );
};

export default AddressType;
