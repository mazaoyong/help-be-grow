export const removePx = (str: string) => {
  return Number(str.replace('px', ''));
};

export function secondsToColonTime(seconds: number) {
  const floorNumber = Math.floor(seconds);
  let minute = parseInt(String(floorNumber / 60), 10) || 0;
  const secondMid = Math.round(floorNumber % 60) || 0;
  const secondLast = secondMid < 10 ? `0${secondMid}` : `${secondMid}`;
  return `${minute}:${secondLast}`;
}
