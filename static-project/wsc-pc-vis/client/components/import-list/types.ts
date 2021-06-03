import { IMPORT_TYPE } from 'pages/student/student-import/constants';

export type SortDirection = 'DESC' | 'ASC';

export type TextAlign = 'left' | 'center' | 'right';

interface ISortType {
  orders: Array<{
    direction: SortDirection;
    nullHandling?: Function;
    property: string;
  }>
}

interface IPageRequest {
  countEnable?: boolean;
  pageNumber: number;
  pageSize?: number;
  sort?: ISortType;
}

type operatorDTO = {
  clientIp: string;
  fansId: number;
  fansType: number;
  mobile: string;
  nickName: string;
  source: string;
  userId: number;
}

export type ImportTaskContent = {
  id: number;
  createAt: string;
  expectRowNum: number;
  successRowNum: number;
  targetKdtName?: string;
  importStage: number;
  message: string;
  operator: operatorDTO;
  importType: IMPORT_TYPE;
}

export type ImportTaskDTO = {
  content: ImportTaskContent[];
  pageable: IPageRequest;
  total: number;
}

type ImportTaskRowFieldErrorDTO = {
  errorRowNum: number;
  taskId: number;
}

export type PollingItem = {
  importStage: number;
  taskId: number;
}

export interface IRowProgress {
  taskId: number;
  progressValue: number;
}

interface IGetProgressRequestParams {
  query: PollingItem[];
}

interface IValidationRequestParams {
  taskIds: number[];
}

interface IImportTaskRequestParams {
  pageRequest: IPageRequest;
}

export interface IImportListProps {
  className?: string;
  needValidation: boolean;
  enablePolling: boolean;
  validationRequest?: (params: IValidationRequestParams) => Promise<ImportTaskRowFieldErrorDTO[]>;
  handleReimport?: (taskId: number, importType: number, failedRowNum: number, targetKdtId: number) => void;
  findTaskProgress?: (params: IGetProgressRequestParams) => Promise<IRowProgress[]>;
  findImportTaskByPageRequest: (params: IImportTaskRequestParams) => Promise<ImportTaskDTO>;
  recordPageUrl?: string;
  hasImportType?: boolean;
}
