import { getColumnChapters } from '../../api';
export const formatChapter = chapter => {
  const {
    id = 0,
    pid: parentChapterId = 0,
    name = '',
    contentNum: contentCount = 0,
    directoryType = 2,
    childrenDirectoryNum: childChapterCount = 0,
  } = chapter;

  const isDefaultChapter = directoryType === 1;

  const hasContent = contentCount > 0;
  const hasChildChapters = childChapterCount > 0;

  return {
    id,
    name,
    hasContent,
    contentCount,
    parentChapterId,
    childChapterCount,
    hasChildChapters,
    isDefaultChapter,
  };
};
export const fetchChapters = (columnAlias, pid = 0) => {
  return getColumnChapters(columnAlias, pid).then(resp => {
    return resp.content.map(formatChapter);
  });
};

export const buildTreeData = chapter => {
  const {
    id,
    pid,
    name,
    hasContent,
    parentChapterId,
    hasChildChapters,
    isDefaultChapter,
    contentCount,
  } = chapter;
  const title = `${name}${parentChapterId ? `` : `（${contentCount}）`}`;
  const treeNodeData = {
    id,
    pid,
    title,
    lazyLoad: hasChildChapters,
    isLeaf: false,
    extra: {
      name,
      hasContent,
      parentChapterId,
      hasChildChapters,
      isDefaultChapter,
      chapterId: id,
    },
  };
  if (hasContent) {
    treeNodeData.children = [
      {
        id: `${id}-content`,
        isLeaf: true,
        extra: {
          chapterId: id,
          hasContent: true,
        },
      },
    ];
  }

  return treeNodeData;
};
