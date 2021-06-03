import { getCourseSchedule as getCourseScheduleWithoutType } from '../../../pages/edu-admin/schedule/api';

export function getCourseSchedule<Params, Response = Record<string, any>>(
  params: Params,
): Promise<Response> {
  return getCourseScheduleWithoutType(params);
}
