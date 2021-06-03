import addZero from '@youzan/utils/string/addZero.js';

export default function getTimestamp(seconds) {
  return `${addZero(Math.floor(seconds / 3600))}: ${addZero(Math.floor((seconds - Math.floor(seconds / 3600)) / 60))}:${addZero(seconds % 60)}`;
};
