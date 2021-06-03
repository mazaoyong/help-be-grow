/**
 * [updateImage 更换图片更新图片数据]
 * @param {object} image 图片
 * @param {object} subEntryData 全部数据
 */
export function updateImage(image, index, subEntryData) {
  const imageData = {
    image_id: image.attachment_id,
    image_url: image.attachment_url,
    image_thumb_url: image.thumb_url,
    image_width: Number(image.width),
    image_height: Number(image.height),
  };
  const { images } = subEntryData;

  if (Array.isArray(images) && images.length) {
    const newImages = images.slice();
    newImages.splice(index, 1, imageData);

    return { ...subEntryData, images: newImages };
  }

  return { ...subEntryData, ...imageData };
}

/**
 * [updateMenu 选择链接后更新subEntry]
 * @param {object} menuData 菜单
 * @param {object} subEntryData 全部数据
 */
export function updateMenu(menuData, subEntryData) {
  return { ...subEntryData, ...menuData };
}

/**
 * 处理所选微页面数据
 * @param {*} data
 */
export function handleFeatureData(data) {
  const link = {
    template_id: data.template_id,
    link_id: data.id || data._id || '',
    link_type: 'image_ad_selection',
    link_title: data.title || data.name || '',
    link_url: data.url || '',
    alias: data.alias || '',
  };

  return link;
}
