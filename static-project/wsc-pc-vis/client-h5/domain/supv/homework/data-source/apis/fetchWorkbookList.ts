import ajax from 'fns/ajax';
import {
  IPageRequest,
  IExerciseBookPageQuery,
  IExerciseBookPageDTO,
} from 'definitions/api/owl/pc/ExerciseBookFacade/findPageByCondition';
import { IPageRequestResult } from '../../commonTypes';
import { baseUrl } from './baseUrl';

export default function fetchWorkbookList(
  pageRequest: IPageRequest,
  query: IExerciseBookPageQuery,
): Promise<IPageRequestResult<IExerciseBookPageDTO>['data']> {
  return ajax({
    url: `${baseUrl}/supv/homework/workbook/findPageByCondition.json`,
    method: 'GET',
    data: {
      pageRequest,
      query,
    },
    loading: false,
  });
}
