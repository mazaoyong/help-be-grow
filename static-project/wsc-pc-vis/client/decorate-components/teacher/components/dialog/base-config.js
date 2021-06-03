import '@youzan/react-components/es/components/choose-dialog/style/index.css';

/**
 * 知识商品
 * choose-dialog基础配置
 */
export default function(config) {
  return {
    needCrossPage: true,
    multiple: true,
    rowKey: 'id',
    canSelectRow: () => true,
    buildQuery(data) {
      return {
        title: data.search,
        pageNumber: data.page,
        pageSize: 5,
        soldStatus: 0,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 5,
        total: data.total,
      };
    },
    actions: [
      {
        type: 'button',
        align: 'left',
        label: '新建',
        onClick() {
          window.open(`${_global.url.v4}/setting/staff`);
        },
      },
      {
        type: 'button',
        align: 'left',
        label: '刷新',
        onClick(evt, context) {
          context.refresh();
        },
      },
      {
        type: 'search',
        align: 'right',
        placeholder: '搜索老师名称',
      },
    ],
    ...config,
  };
}
