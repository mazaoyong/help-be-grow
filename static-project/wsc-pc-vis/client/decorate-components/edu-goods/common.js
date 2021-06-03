import { Notify } from 'zent';

export const handleMaxNumGoods = (list, maxCanAddGoods) => {
  let remainList = list;
  const { length } = list;
  if (length > maxCanAddGoods) {
    remainList = list.slice(0, maxCanAddGoods);
    Notify.error(`最多添加${maxCanAddGoods}个分组，其余${length - maxCanAddGoods}个分组添加失败`);
  }
  return remainList;
};
