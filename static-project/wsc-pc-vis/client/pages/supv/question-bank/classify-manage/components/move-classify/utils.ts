import { IClassifyTreeItem } from '@ability-center/supv/question-bank';
import max from 'lodash/max';

const MAX_LAYER = 5;

type MayError = string | null;
// 检测是否是合法的tree类型
export function isValidateTreeType(
  sourceTreeData: IClassifyTreeItem,
  targetTreeData: IClassifyTreeItem,
): MayError {
  if (!isUnderMaxLayer(sourceTreeData, targetTreeData)) return '节点层级不能超过5级';
  return null;
}

// 只能简单的判断层级关系，因为层级关系是异步获取的，如果用户没有“打开”，就没法获取到子节点，
// 就没法判断这个节点下面是否存在子节点，就没法准确判断
function isUnderMaxLayer(
  sourceTreeData: IClassifyTreeItem,
  targetTreeData: IClassifyTreeItem,
): boolean {
  const { depPointer: sourceDep } = sourceTreeData;
  const { depPointer: targetDep } = targetTreeData;

  if (targetDep.length === MAX_LAYER) return false;

  if (sourceDep.length === MAX_LAYER) return targetDep.length < MAX_LAYER;
  else {
    // 如果符合下面的表达式，说明层级深度最高不超过MAX_LAYER
    // 源数据的层级深度与最高深度的差值 + 目标深度的值 + 插入深度的偏移量（1：要插入目标的下一级）
    if (MAX_LAYER - sourceDep.length + (targetDep.length + 1) <= MAX_LAYER) return true;
    else {
      const maxLength = recursionGetDep(sourceTreeData);
      return maxLength + targetDep.length <= MAX_LAYER;
    }
  }
}
// 递归的获取子节点的最深深度
function recursionGetDep(sourceTreeData: IClassifyTreeItem): number {
  if (sourceTreeData.children.length) {
    const depList = sourceTreeData.children.map(recursionGetDep);
    return (max(depList) || 0) + 1;
  }
  return 1;
}
