enum Gender {
  FEMALE = 0,
  MALE
}

export interface IStudentListItem {
  totalFee: number;
  totalTuition: number;
  registerTime: string;
  mobile: number;
  courseSellType: number;
  remainingFee: number;
  kdtId: number;
  name: string;
  validityEnd: string;
  isDeleted: number;
  totalValue: number;
  totalPresentValue: number;
  enrollmentType: number;
  courseName: string;
  classesList: string[];
  remainingValue: number;
  remainingPresentValue: number;
  courseStatus: number;
  recentStudyTime: string;
  userId: number;
  applyCourseName: string;
  validityBegin: string;
  id: number;
  studentNo: number;
  gender: Gender;
  avatar: string;
  assetNo: string;
  validity: string;
  sellerName: string;
  isTransferCourse: boolean;
  shiftClass: boolean;
  campusName: string;
}

export interface IFilter {
  applyCourseId?: number;
  courseName?: string;
  courseSellType?: number;
  courseStatus?: number;
  endRecentStudyTime?: string;
  endRegisterTime?: string;
  enrollmentType?: number;
  maxCourseTime?: string;
  minCourseTime?: string;
  name?: string;
  startRegisterTime?: string;
  startRecentStudyTime?: string;
  eduClassId?: string;
  staff?: string;
  validityBeginMin?: string;
  validityBeginMax?: string;
  validityEndMin?: string;
  validityEndMax?: string;
}
