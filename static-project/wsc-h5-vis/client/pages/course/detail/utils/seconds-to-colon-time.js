export default function secondsToColonTime(seconds) {
  let minute = parseInt(seconds / 60, 10) || 0;
  let second = Math.round(seconds % 60, 10) || 0;
  if (second === 60) {
    minute++;
    second = 0;
  }
  second = second < 10 ? `0${second}` : `${second}`;
  return `${minute}:${second}`;
}
