// 这个文件用于格式化pageRequest对象和Grid的排序配置项
interface IPageRequest {
  conuntEnable?: boolean;
  pageNumber: number;
  // pageSize选填,默认为20个
  pageSize?: number;
  sort?: ISortType;
}

interface ISortType {
  orders: Array<{
    direction: 'DESC' | 'ASC';
    nullHandling?: Function;
    property: string;
  }>
}

export default function(params: any): IPageRequest {
  const { pageSize = 20, current } = params;
  const res: IPageRequest = {
    pageNumber: current || 1,
    pageSize,
    sort: {
      orders: [
        {
          direction: 'DESC',
          property: 'created_at',
        },
      ],
    },
  };
  return res;
}
