// 校验title
export function validateTitle(title) {
  return title.trim() === '' ? '标题不能为空' : '';
}

// 校验链接
export function validateLink(linkId) {
  return linkId === '' ? '链接不能为空' : '';
}

// 校验图片
export function validateImage(imageId) {
  return imageId === '' ? '请选择一张图片' : '';
}
