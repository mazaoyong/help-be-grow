import omit from 'lodash/omit';
import get from 'lodash/get';

import { IProfileField, DataType } from '../types';

const excludeDataType = [DataType.TEXT, DataType.NUMBER, DataType.PHONE];
function getBasicProps(field: IProfileField, placeholders: string[]) {
  const basicProps: Record<string, any> = omit(field, [
    'applicableScenes',
    'attributeTitle',
    'attributeType',
    'createdAt',
    'serialNo',
  ]);

  basicProps.label = field.label + '：';

  const { dataType } = field;
  // 拿到placeholder，但是原有的placeholder不能被替换
  if (get(field, 'placeholder') === undefined) {
    basicProps.placeholder = get(placeholders, `[${dataType}]`, '请输入');
  }

  if (excludeDataType.includes(dataType)) {
    delete basicProps.dataType;
  }
  return basicProps;
}

export default getBasicProps;
