import { IStudentBaseInfo, GenderEnums } from '../types';
import { get } from 'lodash';

export const defaultAvatar: Record<GenderEnums, string> = {
  [GenderEnums.UNKNOWN]:
    'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
  [GenderEnums.MALE]:
    'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
  [GenderEnums.FEMALE]:
    'https://b.yzcdn.cn/public_files/2019/03/23/f84ffa850a63c65f3127b571da7ae068.png',
};
const STUDENT_INFO_KEY_REFLECT = {
  edu_stuSex: 'studentGender',
  edu_stuAva: 'studentAvatar',
  edu_stuName: 'studentName',
  edu_stuContractPhone: 'studentPhone',
};

/**
 * @description 提取学员信息，将学员基础信息（Head）和其他属性（Rest info）分离开
 */
export default function getStudentBaseInfo(
  studentInfo: Record<string, any>[],
): [Record<string, any>[], IStudentBaseInfo] {
  const omitIndex: number[] = [];
  const studentBaseInfo = {
    studentGender: GenderEnums.MALE,
    studentAvatar: defaultAvatar[GenderEnums.MALE],
    studentName: '',
    studentPhone: '',
  };
  studentInfo.forEach((infoItem, index) => {
    const { attributeKey, value } = infoItem;
    if (attributeKey) {
      const reflectKey = STUDENT_INFO_KEY_REFLECT[attributeKey];
      if (reflectKey && !!value) {
        studentBaseInfo[reflectKey] = value;
        omitIndex.push(index);
      }
    }
  });

  // 如果没有自定义头像，重新根据性别设置一下头像
  studentBaseInfo.studentAvatar =
    studentBaseInfo.studentAvatar || defaultAvatar[studentBaseInfo.studentGender];
  studentBaseInfo.studentPhone = (studentBaseInfo.studentPhone || '').replace(
    /(\d{3})(\d{4})(\d{4})/,
    (_, $1, $2, $3) => `${$1}-${$2}-${$3}`,
  );

  const studentRestInfo = studentInfo
    .filter((_, index) => !omitIndex.includes(index))
    .sort((a, b) => {
      const serialA = get(a, 'serialNo', 0);
      const serialB = get(b, 'serialNo', 0);
      if (serialA === serialB) {
        const profileIdA = get(a, 'attributeId', 0);
        const profileIdB = get(b, 'attributeId', 0);
        return profileIdA - profileIdB;
      }
      return serialB - serialA;
    });

  return [studentRestInfo, studentBaseInfo];
}
