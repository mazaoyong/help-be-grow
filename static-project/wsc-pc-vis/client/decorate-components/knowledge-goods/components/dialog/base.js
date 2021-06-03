import '@youzan/react-components/es/components/choose-dialog/style/index.css';

/**
 * 知识商品
 * choose-dialog基础配置
 */
export default function(config) {
  return {
    needCrossPage: true,
    multiple: true,
    rowKey: 'alias',
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
        label: '刷新',
        onClick(evt, context) {
          context.refresh();
        },
      },
      {
        type: 'search',
        align: 'right',
        placeholder: '搜索商品名称',
      },
    ],
    ...config,
  };
}
