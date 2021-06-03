import cent2yuan from 'fns/currency/cent2yuan';
import qs from 'qs';

interface SearchParams {
  studentIds: string;
  assetNos: string;
  eduClassId?: string;
  eduCourseId?: string;
  kdtId?: string;
}

interface QueryParams {
  pageFrom: string;
  studentIds: string[];
  assetNos: string[];
  eduClassId: string;
  eduCourseId: string;
  kdtId: string;
}

export function div100(num: number) {
  return +((num / 100).toFixed(2));
}

export function initQueryParams() {
  const searchStr = window.location.search.slice(1);
  let queryParams: QueryParams = {
    pageFrom: '',
    studentIds: [],
    assetNos: [],
    eduClassId: '',
    eduCourseId: '',
    kdtId: ''
  };
  if (searchStr) {
    const queryParamsObj: SearchParams = qs.parse(searchStr) as any;
    queryParams.studentIds = queryParamsObj.studentIds.split(',');
    queryParams.assetNos = queryParamsObj.assetNos.split(',');
    queryParams.eduClassId = queryParamsObj.eduClassId || '';
    queryParams.eduCourseId = queryParamsObj.eduCourseId || '';
    queryParams.kdtId = queryParamsObj.kdtId || '';
    queryParams.pageFrom = 'student';
  } else {
    queryParams.pageFrom = 'menu';
  }
  return queryParams;
};

// 做字段联动，根据输入的转入，改变单价与总计
export function setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId, updateBuy = true) {
  setTimeout(() => {
    let values = zentForm.getFormValues();
    let totalTransBuy = 0;
    let totalTransOutAmount = 0;

    eduCourseOrderDTOList.map((item) => {
      totalTransOutAmount += (values[`adjustAmount-${item.orderInfo.orderNo}`] || 0);
      totalTransBuy += (values[`adjustBuy-${item.orderInfo.orderNo}`] || 0);
    }, 0);
    const totalTransInAmount = values[`totalTransInAmount-${studentId}`] || totalTransOutAmount
    totalTransBuy = updateBuy ? totalTransBuy : values[`buy-${studentId}`];

    zentForm.setFieldsValue({
      totalTransOutAmount: {
        ...(values.totalTransOutAmount || {}),
        [studentId]: totalTransOutAmount
      },
      totalTransInAmount: {
        ...(values.totalTransInAmount || {}),
        [studentId]: totalTransInAmount
      },
      [`totalTransInAmount-${studentId}`]: totalTransInAmount,
      [`buy-${studentId}`]: totalTransBuy,
      [`unitPrice-${studentId}`]: totalTransBuy <= 0 ? 0 : cent2yuan(totalTransInAmount * 100 / totalTransBuy)
    });
  }, 0);
}

export function forceValidForm(zentForm, callback = () => {}) {
  zentForm.validateForm(true, () => {
    zentForm.asyncValidateForm(callback);
  });
}

export function multi100AndFloor(num) {
  return Math.floor(num * 100);
}