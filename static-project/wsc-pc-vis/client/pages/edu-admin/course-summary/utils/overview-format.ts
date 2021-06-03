import type { IAssetDetailDTO } from 'definitions/api/owl/pc/SignSummaryFacade/getAssetDetail';
import type { IUseSummaryDetailCommonModelRes } from '../models/details/common/types';

type PartialRes = Pick<IUseSummaryDetailCommonModelRes, 'studentInfo' | 'assetInfo'>;
export function transAssetInfo2overviewInfo(assetInfo: IAssetDetailDTO): PartialRes {
  if (Object.keys(assetInfo).length > 0) {
    return {
      studentInfo: {
        name: assetInfo.studentName,
        mobile: assetInfo.studentMobile,
      },
      assetInfo: assetInfo,
    };
  }
  return {
    studentInfo: null,
    assetInfo: null,
  };
}

interface IRoughStudentInfo {
  attributeItems: Array<{
    applicableScenes: any[];
    attrItem: any[];
    attributeId: number;
    attributeKey: string;
    attributeTitle: string;
    dataType: number;
    value: any;
  }>;
}
const pickedKeys = ['edu_stuName', 'edu_stuContractPhone'];
const reflectKey = ['name', 'mobile'];
export function transStudentInfo2overviewInfo(fetchedStudentInfo: IRoughStudentInfo): PartialRes {
  if (fetchedStudentInfo.attributeItems.length) {
    const studentInfo = {} as PartialRes['studentInfo'];
    fetchedStudentInfo.attributeItems.forEach((attribute) => {
      if (attribute.attributeKey) {
        const targetIdx = pickedKeys.findIndex((key) => key === attribute.attributeKey);
        if (targetIdx >= 0) {
          (studentInfo as any)[reflectKey[targetIdx]] = attribute.value;
        }
      }
    });
    if (Object.keys(studentInfo as any).length > 0) {
      return {
        studentInfo,
        assetInfo: null,
      };
    }
  }
  return {
    studentInfo: null,
    assetInfo: null,
  };
}
