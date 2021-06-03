export interface IEduCourseOrderDTO {
  itemRefundApplyStatus: string;
  itemSurplusRefundAmt: number;
  orderNo: string;
  originPrice: number;
  realPay: number;
  sellerId: number;
  sellerName: string;
  skuId: number;
  orderCreatedAt: number;
}

export interface ICourse {
  alias: string;
  courseSellType: number;
  kdtId: number;
  title: string;
}

export interface IEduCourse {
  alias: string;
  applicableCampusList: any[];
  applicableCampusType: number;
  applyType: number;
  className: string;
  classNum: number;
  createdAt: number;
  id: number;
  kdtId: number;
  maxApply: number;
  minApply: number;
  name: string;
  productNum: number;
  teachType: number;
  updatedAt: number;
}

export interface IAssetTag {
  key: string;
  value: string;
}

export interface IUserAsset {
  assetNo: string;
  assetOriginId: string;
  assetOriginType: number;
  assetStatus: number;
  assetTags: IAssetTag[];
  courseSellType: number;
  endTime: number;
  startTime: number;
  type: number;
  userId: number;
}

export interface ICourseTime {
  locked: number;
  remaining: number;
  reward: number;
  total: number;
  used: number;
}

export interface IEduCourseStudentDTO {
  addressName: string;
  assetNo: string;
  course: ICourse;
  courseTime: ICourseTime | null;
  courseType: number;
  eduClasses: any[];
  eduCourse: IEduCourse;
  eduCourseState: number;
  eduCourseValidDescription: string;
  endTime: number;
  kdtId: number;
  modifyCourseTime: boolean;
  modifyCourseValid: boolean;
  relatedClassNames: any[];
  shiftClass: boolean;
  shopName: string;
  startTime: number;
  userAsset: IUserAsset;
}

export interface ISignedCourseData {
  eduCourseOrderDTO: IEduCourseOrderDTO;
  eduCourseStudentDTO: IEduCourseStudentDTO;
  hasRefundRecord: boolean;
}

export interface ISwitchoutDialogProps {
  onConfirm: (selectCourseItem: any) => void;
  studentInfo: {
    kdtId: number;
    mobile?: number;
    name?: string;
    studentId: number;
  }
}

export interface ISwitchoutListProps {
  onSelect: (selectCourseItem: any) => void;
  studentInfo: ISwitchoutDialogProps['studentInfo'];
}

export type IFormatedSignedCourseItem = IEduCourseOrderDTO & IEduCourseStudentDTO & {hasRefundRecord: boolean}
