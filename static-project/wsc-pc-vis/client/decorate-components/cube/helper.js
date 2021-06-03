import forEach from 'lodash/forEach';
import fill from 'lodash/fill';
import map from 'lodash/map';

/**
 * [initialCubeData 根据sub_entry计算矩阵]
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
export function initialCubeData(props) {
  const { sub_entry: subEntry, width: row, height: col } = props;
  const initialArr = fill(new Array(row), 0).map(() => fill(new Array(col), 0));

  if (subEntry.length > 0) {
    forEach(subEntry, item => {
      const { x, y, width, height } = item;
      const loopWidth = x + width;
      const loopHeight = y + height;

      for (let i = x; i < loopWidth; i++) {
        for (let j = y; j < loopHeight; j++) {
          initialArr[i][j] = 2;
        }
      }
    });
    return initialArr;
  }
  return false;
}

/**
 * 比较取小值
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
function getSmallerNum(a, b) {
  return a < b ? a : b;
}

/**
 * [getBigNum 比较取大值]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
function getBigNum(a, b) {
  return a > b ? a : b;
}

/**
 * [calculatePosition 计算图片占坑位置(起点,宽高)]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function calculatePosition(config) {
  const { pointStart, pointEnd } = config;
  const { row: srow, col: scol } = pointStart;
  const { row: erow, col: ecol } = pointEnd;

  const originRow = getSmallerNum(srow, erow);
  const originCol = getSmallerNum(scol, ecol);

  const origin = {
    row: originRow,
    col: originCol
  };

  const width = Math.abs(pointEnd.row - pointStart.row) + 1;
  const height = Math.abs(pointEnd.col - pointStart.col) + 1;
  return { width, height, origin };
}

/**
 * [getHoverMatrix 获取hover矩阵(state是1的方块)]
 * @param  {[type]} matrixData [description]
 * @return {[type]}            [description]
 */
function getHoverMatrix(matrixData) {
  let recordArray = [];
  map(matrixData, (item, rowIndex) => {
    map(item, (data, colIndex) => {
      if (data === 1) {
        recordArray.push([rowIndex, colIndex]);
      }
    });
  });
  return recordArray;
}

/**
 * [getHoverPosition 计算hover矩阵起点和终点]
 * @param  {[type]} hoverMatrix [description]
 * @return {[type]}             [description]
 */
function getHoverPosition(hoverMatrix) {
  // 初始化
  let smallRow = hoverMatrix[0][0];
  let smallCol = hoverMatrix[0][1];
  let bigRow = hoverMatrix[0][0];
  let bigCol = hoverMatrix[0][1];
  map(hoverMatrix, item => {
    smallRow = getSmallerNum(smallRow, item[0]);
    smallCol = getSmallerNum(smallCol, item[1]);
    bigRow = getBigNum(bigRow, item[0]);
    bigCol = getBigNum(bigCol, item[1]);
  });
  return {
    pointStart: {
      row: smallRow,
      col: smallCol
    },
    pointEnd: {
      row: bigRow,
      col: bigCol
    }
  };
}

/**
 * [addSubEntry 选定魔方块，添加sub_entry]
 * @param {[type]} matrixData [description]
 */
export function addSubEntry(matrixData) {
  let subEntryData = [];

  // hover选中矩阵
  const hoverMatrix = getHoverMatrix(matrixData);

  // 计算hover矩阵起点和终点
  const startAndEnd = getHoverPosition(hoverMatrix);

  // 计算选定矩阵信息(起点,宽高)
  const position = calculatePosition(startAndEnd);
  const { width, height, origin } = position;

  subEntryData.push({
    type: 'cube_selection',
    title: '',
    image_id: '',
    image_url: '',
    image_thumb_url: '',
    image_width: '',
    image_height: '',
    link_id: '',
    link_type: '',
    link_title: '',
    link_url: '',
    width,
    height,
    x: origin.row,
    y: origin.col
  });
  return subEntryData;
}
