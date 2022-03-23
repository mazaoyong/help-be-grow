import { SEARCHYM_OPTIONS } from "./constants";

export const formatMsToStr = (ms: number) => {
  const sec = ms / 1000
  const minutes = Math.floor(sec / 60) % 60;
  const seconds = Math.floor(sec) % 60
  const minStr = minutes ? minutes + '分' : ''
  const secStr = seconds + '秒'
  return minStr + secStr
}

export const getStorageOptions: () => string[] = () => {
  const options = localStorage.getItem(SEARCHYM_OPTIONS);
  try {
    return options ? JSON.parse(options) : [];
  } catch {
    return []
  }
}

export const setStorageOptions = (userInput: string) => {
  const curOptions = getStorageOptions();
  if (userInput) {
    const options = curOptions.includes(userInput) ? curOptions : [userInput, ...curOptions]
    localStorage.setItem(SEARCHYM_OPTIONS, JSON.stringify(options))
    return options;
  }
  return curOptions
}

export const deleteStorageOptions = (text: string) => {
  const curOptions = getStorageOptions();
  const newOptions = curOptions.filter(item => item !== text);
  localStorage.setItem(SEARCHYM_OPTIONS, JSON.stringify(newOptions))
  return newOptions
}