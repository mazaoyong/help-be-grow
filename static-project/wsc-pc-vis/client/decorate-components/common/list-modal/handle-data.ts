const handleMap = new Map();

/**
 * 比较恶心的写法，老组件copy
 */
handleMap.set(0, (res, ctx) => {
  const { total_items: totalItems, data_list: dataList } = res;
  ctx.setState({
    total: totalItems,
    list: dataList,
    pageSize: dataList.length,
    isFetching: false,
  });
});

handleMap.set(1, (res, ctx) => {
  const { items, paginator } = res;
  ctx.setState({
    total: paginator.total_count,
    list: items,
    pageSize: paginator.page_size,
    isFetching: false,
  });
});

handleMap.set(2, (res, ctx) => {
  const { list, total, page_size: pageSize } = res;
  ctx.setState({
    pageSize,
    total,
    list,
    isFetching: false,
  });
});

export default handleMap;
