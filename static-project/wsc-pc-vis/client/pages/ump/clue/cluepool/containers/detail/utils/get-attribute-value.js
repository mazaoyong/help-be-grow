import { DataType } from '@ability-center/student';
import find from 'lodash/find';
import get from 'lodash/get';

const getAttributeValue = (value, type, attrItems) => {
  switch (type) {
    case DataType.ADDRESS:
    case DataType.PROVINCE:
      if (value) {
        try {
          const address = JSON.parse(String(value).replace(/\n/, '\\n'));
          return address.map(({ name }) => name).join('');
        } catch (error) {
          return '-';
        }
      }
      break;
    case DataType.GENDER:
      switch (value) {
        case '1':
          return '男';
        case '2':
          return '女';
        default:
          break;
      }
      break;
    case DataType.MULTI_SELECT:
      if (attrItems) {
        if (typeof value === 'string') {
          const selectedItems = value.split(',').map(id => find(attrItems, { id: Number(id) }));
          if (Array.isArray(selectedItems) && selectedItems.every(sel => !!sel)) {
            return selectedItems.map(item => item.value).join(', ');
          }
        }
      }
      break;
    case DataType.SELECT:
      if (attrItems) {
        return get(find(attrItems, { id: Number(value) }), 'value');
      }
      break;
    default:
      return value || '-';
  }
};

export default getAttributeValue;
