import { IUserExercisePageDTO, IPage, IStudentBriefDTO } from 'definitions/api/owl/api/UserExerciseFacade/findUserExercisePage';
import { WorkbookDetailEntity } from './workbookDetailEntity';
import { getWorkbookDetail } from '../services/index';
import { MemoryCacheManager } from '@/utils/cache/memoryCacheManager';

export class BriefWorkbook {
  /** 店铺id */
  kdtId: number;
  /** 学员信息 */
  student: IStudentBriefDTO;
  /** 作业本alias */
  alias: string;
  /** 作业本id */
  id: number;
  /** 名称 */
  title: string;

  constructor(data: IUserExercisePageDTO) {
    this.kdtId = data.kdtId;
    this.student = data.student;
    this.alias = data.alias;
    this.id = data.id;
    this.title = data.title;
  }

  get workbook() {
    return getWorkbookDetail({
      alias: this.alias,
    });
  }

  get workbookWithCache() {
    const cacheManager = MemoryCacheManager.getInstance<WorkbookDetailEntity>(_global.kdtId);
    const cache = cacheManager.getItem('BriefWorkbook-' + this.alias);
    if (cache) {
      return Promise.resolve(cache);
    } else {
      return this.workbook.then(workbook => {
        cacheManager.setItem('BriefWorkbook-' + this.alias, workbook);
        return workbook;
      });
    }
  }
}

export class WorkbookListEntity {
  origin: IPage<IUserExercisePageDTO>;
  content: BriefWorkbook[];
  constructor(data: IPage<IUserExercisePageDTO>) {
    this.origin = data;
    this.content = data.content.map(workbook => new BriefWorkbook(workbook));
  }
}
