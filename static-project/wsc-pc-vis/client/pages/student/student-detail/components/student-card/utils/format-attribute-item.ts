import { DataType } from '@ability-center/student';
import { format } from 'date-fns';

type AddressTypeMaybe = Array<{ code: number; name: string } | string>;

export default function formatAttributeItem(rowData: Record<string, any>) {
  const dataType: DataType = rowData.dataType || DataType.TEXT;
  let rawValue = rowData.value;

  let responseValue: string = rawValue;
  switch (dataType) {
    case DataType.DATE:
      if (rawValue) {
        responseValue = format(rawValue, 'YYYY-MM-DD');
      }
      break;
    case DataType.PROVINCE:
    case DataType.ADDRESS:
      try {
        if (rawValue && typeof rawValue === 'string') {
          const parseData = JSON.parse(rawValue);
          if (Array.isArray(parseData)) {
            const convertAddressList = ((parseData as unknown) as AddressTypeMaybe)
              .map(item => (typeof item === 'string' ? { code: 0, name: item } : item))
              .map(item => item.name);
            // 北京市北京市东城区->北京市东城区
            responseValue = [...new Set(convertAddressList)].join('');
          }
        }
        break;
      } catch (err) {
        console.error('source data', rawValue);
        console.error('error', err);
        break;
      }
    case DataType.SELECT:
    case DataType.MULTI_SELECT:
      if (typeof rawValue === 'string') {
        const attributeItem = ((rowData.attrItem || []) as unknown) as Array<
        { id: number; value: string } & Record<string, any>
        >;
        const selectedItem = rawValue.split(',');
        responseValue = selectedItem
          .map(item => {
            const targetItem = attributeItem.find(attrItem => attrItem.id === Number(item));
            return targetItem ? targetItem.value : undefined;
          })
          .join('，');
      }
      break;
    default:
      break;
  }
  return responseValue || '-';
}
