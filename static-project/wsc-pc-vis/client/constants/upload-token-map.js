const materialsUrl = _global.url.materials || '//materials.youzan.com';
const baseUrl = _global.url.base || '//www.youzan.com';

const uploadTokenMap = {
  shopImg: `${materialsUrl}/shop/pubImgUploadToken.json`, // 会在我的文件中显示，图片上传常用接口
  shopAudio: `${materialsUrl}/shop/pubAudioUploadToken.json`, // 会在我的文件中显示，音频上传常用接口
  storageImg: `${materialsUrl}/storage/pubImgUploadToken.json`, // 不会在我的文件中显示，如店铺Logo
  storageImgPrivate: `${materialsUrl}/storage/priImgUploadToken.json`, // 不会在我的文件中显示，如店铺认证
  salesmanImg: `${baseUrl}/salesman/common/image/getToken.json`, // 分销员上传图片
};

export default uploadTokenMap;
