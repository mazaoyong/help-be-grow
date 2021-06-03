/**
 * 获取图片的 exif 信息 - getExifTags
 *
 * @param img {Image | Blob | File} 其中，Image对象 img.src 支持：
 *                                    1. Data URI
 *                                    2. 网络图片 URL
 * @param tagName {String}
 * @return promise resolve(tags) -
 *                                 1. 获取 EXIF 成功：tags = { tagName: tagValue, ...}
 *                                 2. 获取 EXIF 失败：tags = false
 */

// 可自行扩展...
const TiffTags = {
  0x0112: 'orientation',
};

function base64ToArrayBuffer(base64) {
  base64 = base64.replace(/^data:([^;]+);base64,/gmi, '');
  const binary = atob(base64);
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

function getStringFromDB(buffer, start, length) {
  let outstr = '';
  for (let n = start; n < start + length; n++) {
    outstr += String.fromCharCode(buffer.getUint8(n));
  }
  return outstr;
}

// 保证传入 callback 的类型是 ArrayBuffer
function getImageData(img, callback) {
  if (img.src) { // 传入的是 Image 对象实例
    if (/^data:/i.test(img.src)) { // Data URI
      const arrayBuffer = base64ToArrayBuffer(img.src);
      callback(arrayBuffer);
    } else { // 网络图片 URL
      const http = new XMLHttpRequest();
      http.onload = function() {
        if (this.status === 200 || this.status === 0) {
          callback(http.response);
        } else {
          callback(0); // eslint-disable-line
        }
      };
      http.open('GET', img.src, true);
      http.responseType = 'arraybuffer';
      http.send(null);
    }
  } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) { // 传入的是 Blob | File
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      callback(e.target && e.target.result);
    };
  } else {
    callback(0); // eslint-disable-line
  }
}

function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
  let vals;
  let offset;
  const type = file.getUint16(entryOffset + 2, !bigEnd);
  const numValues = file.getUint32(entryOffset + 4, !bigEnd);
  const valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;

  // 不同的 type 有不同的读取数据方式, 可按需扩展 ...
  switch (type) {
    case 2: // ascii, 8-bit byte
      offset = numValues > 4 ? valueOffset : (entryOffset + 8);
      return getStringFromDB(file, offset, numValues - 1);

    case 3: // short, 16 bit int
      if (numValues === 1) {
        return file.getUint16(entryOffset + 8, !bigEnd);
      }
      offset = numValues > 2 ? valueOffset : (entryOffset + 8);
      vals = [];
      for (let n = 0; n < numValues; n++) {
        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
      }
      return vals;
  }
}

function readTags(file, tiffStart, dirStart, strings, bigEnd) {
  const tags = {};
  const entries = file.getUint16(dirStart, !bigEnd);
  for (let i = 0; i < entries; i++) {
    const entryOffset = dirStart + i * 12 + 2;
    const tag = strings[file.getUint16(entryOffset, !bigEnd)];
    if (tag) {
      tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
    }
  }
  return tags;
}

function readEXIFData(file, start) {
  const check = getStringFromDB(file, start, 4);
  if (check !== 'Exif') {
    return false;
  }
  const tiffOffset = start + 6;
  const endian = file.getUint16(tiffOffset);
  if (endian !== 0x4949 && endian !== 0x4D4D) { // 不是有效的 TIFF 数据
    return false;
  }
  const bigEnd = endian === 0x4D4D; // 大小端模式
  const firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
  const tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

  // ExifIFDPointer, GPSInfoIFDPointer, thumbnail 如有需要可自行扩展 ...

  return tags;
}

// 寻找 EXIF marker, 找到则读 EXIF 数据, 否则返回 false
function findEXIFinJPEG(file) {
  try {
    const dataView = new DataView(file);
    if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) { // 不是一张有效的 jpeg 图片
      return false;
    }
    let offset = 2;
    while (offset < file.byteLength) {
      if (dataView.getUint8(offset) !== 0xFF) { // 有效的 marker 必定是 0xFF 开头的
        return false;
      }
      const marker = dataView.getUint8(offset + 1);
      if (marker === 225) { // EXIF 的 marker 为 0xFFE1, 0xE1 -> 225
        return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
      }
      // 找到了非 EXIF 的 marker, 继续寻找下一个 marker
      offset += 2 + dataView.getUint16(offset + 2);
    }
  } catch (e) {
    return false;
  }
}

function getExifTags(img) {
  return new Promise((resolve) => {
    getImageData(img, res => {
      const tags = findEXIFinJPEG(res);
      resolve(tags);
    });
  });
}

export { getExifTags };
