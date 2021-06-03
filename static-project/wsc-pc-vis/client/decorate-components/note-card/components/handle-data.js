const handleMap = new Map();

handleMap.set(0, (res, ctx) => {
  const { data, count } = res;
  ctx.setState({
    total: count,
    list: data,
    pageSize: 8,
    isFetching: false,
  });
});

export default handleMap;
