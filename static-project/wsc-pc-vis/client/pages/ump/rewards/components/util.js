export function getConditionType(couseSellType, rewardNodeType, startRewardType, endRewardType) {
  let conditionType = 1;
  switch (rewardNodeType) {
    case 1:
      conditionType = couseSellType;
      break;
    case 2:
      conditionType = startRewardType === 1 ? 4 : 5;
      break;
    case 3:
      conditionType = endRewardType === 1 ? 6 : 7;
      break;
  }
  return conditionType;
}

export function getRewardType(rewardNodeType, conditionType) {
  let startRewardType = 1;
  let endRewardType = 1;

  switch (rewardNodeType) {
    case 2:
      conditionType === 5 && (startRewardType = 2);
      break;
    case 3:
      conditionType === 7 && (endRewardType = 2);
      break;
  }

  return {
    startRewardType,
    endRewardType,
  };
}
