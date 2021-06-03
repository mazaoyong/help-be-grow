const reachPageBottom = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  // 变量windowHeight是可视区的高度
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;

  // 变量scrollHeight是滚动条的总高度（当前可滚动的页面的总高度）
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

  // 滚动条到底部
  if (scrollTop + windowHeight >= scrollHeight) {
    return true;
  }
  return false;
};

export default reachPageBottom;
