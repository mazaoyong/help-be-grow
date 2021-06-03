interface TransOutOrder {
  orderNo: string;
  transferOutBuyAssert: number;
  transferOutAmt: number;
  transferOutReward: number;
  unitPrice: number;
}

export interface Detail {
  orderNo: string;
  studentTransferDTO: {
    studentId: number;
    studentName: string;
    mobile: string;
  };
  transferTime: string;
  otherInfo: {
    cashierName: string;
    courseConsultantName: string;
    teacherName: string;
    customerSignature: string;
    remark: string;
  };
  transferOut: {
    courseName: string;
    eduCourseName: string;
    courseSellType: number;
    transferOutTotalAmt: number;
    orders: TransOutOrder[]
  };
  transferIn: {
    buy: number;
    className: string;
    eduCourseName: string;
    reward: number;
    transferInAmt: number;
    transferInTotalAmt: number;
    validTime: string;
    unitPrice: number;
  }
}