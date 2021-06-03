export const calcIntroDialogPosition = () => {
  const dom = document.getElementById('js-react-container');
  if (!dom) {
    return [0, 0];
  }

  const fansPosterNode = findFansPosterNode();
  if (!fansPosterNode) {
    return [0, 0];
  }
  return [getLeft(fansPosterNode), getTop(fansPosterNode)];
};

export function findFansPosterNode() {
  const itemsNodeList = document.querySelectorAll('.application-item');
  for (const node of itemsNodeList) {
    const innerHTML = node.children[0].innerHTML;
    if (innerHTML && innerHTML.includes('涨粉海报')) {
      return node;
    }
  }
  return null;
}

export function getFansPosterWidth() {
  const fansPosterNode = findFansPosterNode();
  return fansPosterNode.clientWidth;
}
// 获取元素的纵坐标
function getTop(e) {
  let offset = e.offsetTop;
  if (e.offsetParent !== null) {
    offset += getTop(e.offsetParent);
  }
  return offset;
}
// 获取元素的横坐标
function getLeft(e) {
  let offset = e.offsetLeft;
  if (e.offsetParent !== null) {
    offset += getLeft(e.offsetParent);
  }
  return offset;
}
