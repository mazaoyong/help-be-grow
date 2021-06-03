export function isPromiseLike(p) {
  if (!p) {
    return false;
  }

  const proto = Object.getPrototypeOf ? Object.getPrototypeOf(p) : p.__proto__; // eslint-disable-line
  return typeof proto.then === 'function';
}

export function isArray(arr) {
  return Object.prototype.toString.apply(arr) === '[object Array]';
}

// 计算每个sku后面有多少项
export function getLevels(tree) {
  let level = [];
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1;
    } else {
      level[i] = 1;
    }
  }
  return level;
}

export function getSkuLength(tree) {
  let skuLen = 0;

  tree.forEach(item => {
    const { leaf } = item;
    if (!leaf || leaf.length === 0) return true;
    skuLen = (skuLen || 1) * leaf.length;
  });

  return skuLen;
}

export function ignoreEmptySku(tree, options) {
  let { optionValue = 'dictId' } = options || {};
  let newTree = [];
  tree.forEach(item => {
    if (item[optionValue] && item.leaf) {
      let itemLeaf = [];
      item.leaf.forEach(atom => {
        if (atom[optionValue]) {
          itemLeaf.push(atom);
        }
      });
      item.leaf = itemLeaf;
      if (itemLeaf.length > 0) {
        newTree.push(item);
      }
    }
  });
  return newTree;
}

/**
 * 判断两个sku是否相同
 *
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {boolean}         [description]
 */
export function isSame(prevSKU, nextSKU, options) {
  let { optionValue = 'dictId' } = options || {};

  let equalResult =
    nextSKU.length === prevSKU.length &&
    nextSKU.every(({ leaf = [] }, index) => {
      let prevLeaf = prevSKU[index].leaf || [];
      return (
        prevSKU[index][optionValue] === nextSKU[index][optionValue] &&
        leaf.length === prevLeaf.length &&
        leaf.map(item => item[optionValue]).join(',') ===
          prevLeaf.map(item => item[optionValue]).join(',')
      );
    });

  return equalResult;
}

/**
 * 查找两个sku有哪些变动项
 *
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {boolean}         [description]
 */
export function diffSku(prevSKU, nextSKU, options) {
  let { optionValue = 'dictId' } = options || {};
  let action = null;
  // 两个 sku 不同的数量
  let diffCount = 0;

  // group改变，清空重新渲染
  if (nextSKU.length !== prevSKU.length) {
    return { type: 'rebuild' };
  }

  // 检查更新的规格值
  for (let index = 0; index < nextSKU.length; index++) {
    let item = nextSKU[index];
    let prevItem = prevSKU[index];
    if (item[optionValue] !== prevItem[optionValue]) {
      action = { type: 'rebuild' };
      break;
    }

    let nextLeaf = item.leaf || [];
    let prevLeaf = prevItem.leaf || [];
    let nextLeafLen = nextLeaf.length;
    let prevLeafLen = prevLeaf.length;

    if (nextLeafLen > prevLeafLen) {
      // 增加
      action = {
        type: 'add',
        leaf: nextLeaf[nextLeafLen - 1],
        sku: item,
      };
      break;
    }

    for (let leafIndex = 0; leafIndex < nextLeafLen; leafIndex++) {
      let leafItem = nextLeaf[leafIndex];
      let leafEqual = leafItem[optionValue] === prevLeaf[leafIndex][optionValue];
      if (!leafEqual) {
        if (nextLeafLen < prevLeafLen) {
          // 删除
          action = {
            type: 'delete',
            leaf: prevLeaf[leafIndex],
            sku: item,
          };
          break;
        } else {
          // 替换
          action = {
            type: 'change',
            prev: prevLeaf[leafIndex],
            next: leafItem,
            sku: item,
            index: index + 1,
          };
          diffCount++;
          if (diffCount > 1) {
            break;
          }
        }
      }
    }

    if (action === null && nextLeafLen < prevLeafLen) {
      action = {
        type: 'delete',
        leaf: prevLeaf[prevLeafLen - 1],
        sku: item,
      };
    }

    if (action !== null) {
      if (diffCount < 1) {
        break;
      } else if (diffCount > 1) {
        // 表示进行了自定义排序
        action = {
          type: 'resort',
        };
        break;
      }
    }
  }

  return action;
}
