interface IOldPic {
  id: string;
  cover: string;
  height: number;
  width: number; 
  attachment_id: string;
  attachment_full_url: string;
}

interface INewPic {
  picHeight: number;
  picWidth: number; 
  picId: string;
  cover: string;
}

/**
 * 新旧两种picture 对象的转换工具方法，全部迁移完毕后，组件直接支持新版数据结构，可以废弃此方法
 * @export
 * @param {IOldPic} 
 * @returns {INewPic} 
 */
export function transOldToNew(oldPic: IOldPic): INewPic {
  return {
    picHeight: oldPic.height,
    picWidth: oldPic.width,
    picId: oldPic.attachment_id || oldPic.id,
    cover: oldPic.attachment_full_url || oldPic.cover,
  }
}

/**
 * 新旧两种picture 对象的转换工具方法，全部迁移完毕后，组件直接支持新版数据结构，可以废弃此方法
 * @export
 * @param {INewPic} 
 * @returns {IOldPic} 
 */
export function transNewToOld(newPic: INewPic): IOldPic {
  return {
    id: newPic.picId,
    cover: newPic.cover,
    height: newPic.picHeight,
    width: newPic.picWidth, 
    attachment_id: newPic.picId,
    attachment_full_url: newPic.cover,
  }
}
