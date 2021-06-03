import { getCourseRecord as getCourseRecordWithoutType } from '../../../pages/edu-admin/api/educourse';

export function getCourseRecord<Params, Response = Record<string, any>>(
  params: Params,
): Promise<Response> {
  return getCourseRecordWithoutType(params);
}
