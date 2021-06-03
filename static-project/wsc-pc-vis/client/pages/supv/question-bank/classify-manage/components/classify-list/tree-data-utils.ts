import { ICategoryItem } from '../../../../api/question-bank';
import { IClassifyTree, IClassifyTreeItem } from './types';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';
import get from 'lodash/get';
import merge from 'lodash/merge';

type DepPointerType = IClassifyTreeItem['depPointer'];
export function getCategoryTreeData(
  newList: ICategoryItem[],
  sourceList: IClassifyTree,
  dep: DepPointerType,
  omitChild?: DepPointerType,
): IClassifyTree {
  if (Array.isArray(newList)) {
    const cloneList = clone(sourceList);
    const addonList: IClassifyTree = [];

    // 在获取列表中，可能需要剔除某些节点
    const hasOmitDep = omitChild && omitChild.length > 0;
    const omitDepString = (omitChild || []).join('->');
    const omitDepReg = hasOmitDep ? new RegExp('^' + omitDepString) : null;
    newList.forEach((newCategory, index) => {
      // 匹配并剔除某些节点及其子节点
      const curDep = dep.concat(index);
      const curDepString = curDep.join('->');
      if (omitDepReg) {
        if (hasOmitDep && omitDepReg.test(curDepString)) {
          index += 1;
          return;
        }
      }

      addonList.push(getNewCategoryNode(index, newCategory, { curDep, dep }));
    });

    let targetList: IClassifyTree = cloneList;
    // 不论是否有深度信息，先检查一次是否有全部分类的存在，如果有，作为初始节点开始进行reduce查找
    const firstTreeNode = cloneList[0];
    if (firstTreeNode && firstTreeNode.id === 0) {
      targetList = firstTreeNode.children;
    }

    targetList = dep.reduce((prevList, curDep, curDepIndex) => {
      const tempList = prevList.filter(
        (categoryTreeNode) => (categoryTreeNode.depPointer || [])[curDepIndex] === curDep,
      );
      if (tempList && tempList[0].children) {
        return tempList[0].children;
      }
      return [];
    }, targetList);

    // 清空数组，然后添加新数组
    targetList.splice(0, targetList.length);
    targetList.push(...addonList);

    return cloneList;
  }
  return [];
}

function getNewCategoryNode(
  index: number,
  newCategory: ICategoryItem,
  depInfo: { curDep: DepPointerType; dep: DepPointerType },
): IClassifyTreeItem {
  const { name, parentId, id, questionCount } = newCategory;
  const { curDep, dep } = depInfo;
  return {
    id,
    parentId,
    title: name,
    children: [],
    // 初始化节点的时候展开状态都是false
    expand: false,
    questionCount,
    // 最多五级
    isLeaf: curDep.length === 5,
    depPointer: dep.concat(index),
  };
}

function findTargetTreeDataList(
  clonedList: IClassifyTree,
  dep: DepPointerType,
): [IClassifyTree, number] | undefined {
  if (Array.isArray(dep) && dep.length) {
    let targetTreeDataList: IClassifyTree = clonedList;
    const targetDepIndex = dep.splice(-1)[0];
    const reduceDeps = dep;
    if (reduceDeps.length) {
      targetTreeDataList = reduceDeps.reduce((prevTreeDataList, depIndex) => {
        const res = get(prevTreeDataList, `[${depIndex}].children`);
        return res;
      }, clonedList);
      return [targetTreeDataList, targetDepIndex];
    } else if (targetDepIndex !== undefined) {
      return [clonedList, targetDepIndex];
    }
    return undefined;
  }
}

export function updateTreeData(
  modifiedValues: Record<string, any>,
  list: IClassifyTree,
  dep: DepPointerType,
): IClassifyTree {
  if (Array.isArray(dep) && dep.length) {
    // 后续的merge操作存在[]类型，需要用深拷贝
    const clonedList = cloneDeep(list);
    const res = findTargetTreeDataList(clonedList, dep);
    if (res) {
      const [targetTreeDataList, targetDepIndex] = res;
      merge(targetTreeDataList[targetDepIndex], modifiedValues);
      return clonedList;
    }
  }
  return list;
}

export function deleteTreeData(list: IClassifyTree, dep: DepPointerType): IClassifyTree {
  if (Array.isArray(dep) && dep.length) {
    const clonedList = clone(list);
    const res = findTargetTreeDataList(clonedList, dep);
    if (res) {
      const [targetTreeDataList, targetDepIndex] = res;
      targetTreeDataList.splice(targetDepIndex, 1);
      return clonedList;
    }
  }
  return list;
}
