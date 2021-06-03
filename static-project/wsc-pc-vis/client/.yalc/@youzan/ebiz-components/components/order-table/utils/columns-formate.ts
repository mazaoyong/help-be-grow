import { orderTableCols } from '../types';
import difference from 'lodash/difference';

export interface IFormatedCols {
  headKeys: string[];
  bodyKeys: string[];
  columns: orderTableCols;
}

/** 这个方法用于格式化columns属性，并抽取出其中用于渲染到每一行头部的key */
export default function fromateColumns(columns: orderTableCols): IFormatedCols {
  const headKeys: string[] = [];
  // ext指的是扩展，表示使用者想要额外渲染的单元格
  let extNumber = 1;
  let bodyKeys = columns.map(col => {
    const { isHead } = col;
    let { name } = col;
    // 如果这个columns.item的配置中不含有name，就添加name
    if (!name) {
      name = `extCol${extNumber}`;
      extNumber += 1;
      col.name = name;
    }
    if (isHead) {
      headKeys.push(name);
    }
    return name;
  });
  bodyKeys = difference(bodyKeys, headKeys);
  return {
    headKeys,
    bodyKeys,
    columns,
  };
}
