import { Toast } from 'vant';
import { ref, Ref } from '@youzan/tany-vue';
import fetchWorkbookListApi from '../data-source/apis/fetchWorkbookList';
import fetchWorkbook from '../data-source/apis/fetchWorkbook';

export function fetchWorkbookList(pageRequest: {
  pageNumber: number
  pageSize: number
  sort?: any
}, query: any, errorText: string) {
  return fetchWorkbookListApi(
    pageRequest,
    query,
  ).then(res => {
    if (res) {
      return res;
    } else {
      Toast(errorText || '获取作业本列表失败');
    }
  }).catch(errMsg => Toast(errMsg || errorText || '获取作业本列表失败'));
}

export function createWorkbookListApi(query?: any, loadedRef: Ref<number> = ref(0)) {
  return ({ page, pageSize, errorText = '' }: { page: number, pageSize: number, errorText?: string }) => {
    return fetchWorkbookList({
      pageNumber: page,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'latest_create_time',
          },
          {
            direction: 'DESC',
            property: 'latest_sub_time',
          },
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    }, query || {}, errorText)
      .then(res => {
        if ('content' in res) {
          loadedRef.value += (res.content || []).length;

          return {
            list: res.content,
            hasNext: Number(res.total) > loadedRef.value,
            totalPages: res.totalPages
          };
        }
      });
  }
}

export function fetchWorkbookTeachers(id: number) {
  return fetchWorkbook({ id })
    .then((res: any) => {
      if (res) {
        return res.teacherList;
      }
    }).catch((errMsg: string) => Toast(errMsg));
}
