import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../index';

export default function(params) {
  const { selectedSku, activityData } = store.state;
  params.umpInfo.promotionType = ACTIVITY_TYPE.POINTS_EXCHANGE;
  params.umpInfo.promotionId = activityData.activityId;
  let pointsPrice = activityData.sku.minPoint.points;
  if (selectedSku) {
    pointsPrice = activityData.sku.map[selectedSku.id].points;
  }
  params.umpInfo.pointsExchange = {
    pointsPrice,
    usePoints: true,
  };
}
