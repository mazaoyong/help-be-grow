import ajax from 'fns/ajax';
import { baseUrl } from './baseUrl';

export default function fetchWorkbook(
  data: { id: number },
 ): Promise<any> {
  return ajax({
    url: `${baseUrl}/supv/homework/workbook/getExerciseBookDetail.json`,
    method: 'GET',
    data,
    loading: true,
  });
}
