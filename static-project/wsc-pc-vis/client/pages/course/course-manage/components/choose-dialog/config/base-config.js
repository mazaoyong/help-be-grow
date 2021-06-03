export default function getBaseConfig() {
  return {
    title: '',
    url: '',
    multiple: false,
    columns: [],
    buildQuery(data) {
      return {
        title: data.search,
        pageNumber: data.page,
        pageSize: 4,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 4,
        total: data.total,
      };
    },
    actions: [
      {
        type: 'search',
        align: 'right',
      },
    ],
  };
}
