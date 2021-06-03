interface VisResponse {
  code: number;
  data: any;
  errorData?: any;
  message: string;
  requestId?: string;
  success: boolean;
}

interface PageableResponseData<T> {
  content: T[];
  pageable: any;
  total: number;
  totalPages: number;
}

// 信息采集项
interface ICollectSetting {
  attributeKey: string;
  attrItem: Array<{
    id: number;
    order: number;
    value: string;
  }>;
  attributeTags: any[];
  attributeType: 1 | 2;
  attributeTitle: string;
  createdAt: number;
  canDel: boolean;
  dataType: number;
  needFill: boolean;
  placeholder: string;
  showDefault: boolean;
  serialNo: number;
}

// 学员接口
interface IStudent {
  alias: string;
  address: string;
  avatar: string;
  age: string;
  bornDate: string;
  customAttributeItems: any[];
  customer: any;
  gender: number;
  grade: string;
  idCardNo: string;
  id: number;
  lastClassTime: string;
  mobile: string;
  monthAge: string;
  name: string;
  nickName: string;
  phoneNumber: string;
  school: string;
  studentNo: string;
  userId: number;
  wechatAccount: string;
}
