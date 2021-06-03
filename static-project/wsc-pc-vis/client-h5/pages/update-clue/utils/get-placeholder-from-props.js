
// 根据需求，需要将必填的资料项的placeholder带上“（必填）”字样
export default function(attr, defualtPlaceholder) {
  if (attr.needFill) {
    return `${defualtPlaceholder}（必填）`;
  }
  return defualtPlaceholder;
};
