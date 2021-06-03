import { ITreeData } from 'zent';

export const checkMoveUp: (data: ITreeData[], node: ITreeData) => boolean = (data, node) => {
  const filterData = getFilterData(data, node);
  if (!filterData.length) {
    return false;
  }
  return !(filterData[0].id === node.id);
};

export const checkMoveDown: (data: ITreeData[], node: ITreeData) => boolean = (data, node) => {
  const filterData = getFilterData(data, node);
  if (!filterData.length) {
    return false;
  }
  return !(filterData[filterData.length - 1].id === node.id);
};

// 目录数据处理
export const mergeDirectory: (params: {
  currentData: ITreeData[],
  newData: ITreeData[],
  currentLevel: number,
  maxLevel: number,
  showRoot: boolean | undefined,
  showUnClassify: boolean,
  openId?: number
}) => ITreeData[] = (params) => {
  const { currentData, newData, currentLevel, maxLevel, showUnClassify, openId } = params;
  if (!Array.isArray(newData) || !newData.length) {
    return currentData;
  }
  const isMaxLevel = currentLevel === maxLevel;
  const filterPids = [newData[0].pid];
  let totalNumber = 0;
  const filterData = currentData.filter(item => {
    if (item.id === newData[0].pid) {
      item.cached = true;
      if (item.childrenDirectoryNum === 0) {
        item.childrenDirectoryNum = 1;
        item.isLeaf = false;
      }
    }
    const condition = filterPids.includes(item.pid);
    if (condition) {
      filterPids.push(item.id);
    }
    return !condition;
  });

  const transferData: ITreeData[] = newData.map(node => {
    if (isMaxLevel || !node.childrenDirectoryNum) {
      node.isLeaf = true;
    } else {
      node.isLeaf = false;
    }
    node.cached = false;
    node.level = currentLevel;
    node.parentId = node.pid;
    return node;
  });

  let totalData = [...filterData, ...transferData];
  if (!showUnClassify) {
    totalData = totalData.filter(item => item.directoryType !== 1);
  }
  totalData.forEach(item => {
    if (item.pid === 0) {
      totalNumber += item.contentNum;
    }
    if (item.id === openId) {
      item.expand = true;
    }
  });
  const rootNode = totalData.find(item => item.id === -1);
  if (rootNode) {
    rootNode.contentNum = totalNumber;
  }
  return totalData;
};

const getFilterData: (data: ITreeData[], node: ITreeData) => ITreeData[] = (data, node) => {
  const { pid } = node;
  const filterData = data.filter((treeNode) => treeNode.pid === pid);
  filterData.sort((a, b) => parseInt(a.serialNo) - parseInt(b.serialNo));
  return filterData;
};
