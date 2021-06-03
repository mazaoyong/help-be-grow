let deviceHeight: number = 0;

export default function getIntersectionRatio(DOMRect: DOMRect): {
  intersectionRatio: number;
  contentDisplayRatio: number;
} {
  if (!deviceHeight && window) {
    deviceHeight = window.innerHeight;
  }
  const { height, top, bottom } = DOMRect;
  let contentDisplayRatio = 0;
  if (top <= deviceHeight) {
    const ratio = getRatioRound((deviceHeight - top) / height);
    contentDisplayRatio = Math.min(Math.max(ratio, 0), 100);
  }

  let intersectionRatio = 1;
  if (top >= 0) {
    intersectionRatio = getRatioRound((deviceHeight - top) / deviceHeight);
  } else if (bottom <= deviceHeight) {
    intersectionRatio = getRatioRound(1 - (deviceHeight - bottom) / deviceHeight);
  }
  return {
    intersectionRatio,
    contentDisplayRatio,
  };
}

function getRatioRound(ratio: number): number {
  const roundInt = Math.round(ratio * 100) / 100;
  if (roundInt > 0.95) return 1;
  return Math.min(roundInt, 1);
}
