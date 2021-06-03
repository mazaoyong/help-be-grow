import store from '../index';

export default function(params, payload, compositionCB) {
  const { activityData } = store.state;
  const { tuitionDeduction, activityId, activityType, activityAlias } = activityData || {};

  params.umpInfo.tuitionDeduction = tuitionDeduction;

  if (compositionCB) {
    compositionCB({
      activityId,
      activityType,
      activityAlias,
      tuitionDeduction,
    });
  }
}
