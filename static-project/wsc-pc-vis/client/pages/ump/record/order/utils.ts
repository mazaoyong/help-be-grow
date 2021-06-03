import { DataType } from '@ability-center/student';

interface IReceiverInfo {
  attributeTitle: string;
  attributeId: number | string;
  attributeValue: any;
  dataType: DataType;
}

interface IRecord extends Record<string, any> {
  orderNo?: string;
}

interface IConvertRecord extends IRecord {
  id?: string;
}

const RECEIVER_KEYMAP: Record<string, [string, number]> = {
  name: ['领取人', DataType.TEXT],
  mobile: ['手机', DataType.PHONE],
  createdAt: ['领取时间', DataType.DATE],
};

export function receiverInfoAdaptor(receiverInfo: Record<number, any>): { customizeItems: IReceiverInfo[] } {
  const convertedReceiveInfo: IReceiverInfo[] = [];

  Object.entries(receiverInfo).forEach(([receiverInfoKey, value]) => {
    const [attributeTitle, dataType] = RECEIVER_KEYMAP[receiverInfoKey];
    if (attributeTitle !== undefined) {
      convertedReceiveInfo.push({
        attributeTitle,
        attributeId: receiverInfoKey,
        attributeValue: value,
        dataType,
      });
    }
  });

  return {
    customizeItems: convertedReceiveInfo,
  };
}

export function setRecordId(record: IRecord, index: number): IConvertRecord {
  let result = record;
  const recordKeys = Object.keys(record || {});
  if (recordKeys.includes('orderNo') && record.orderNo !== undefined) {
    result.id = record.orderNo + index;
  }

  return result;
}
