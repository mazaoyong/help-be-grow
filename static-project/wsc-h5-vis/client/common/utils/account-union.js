import userInfoAuthorize from '@youzan/user-info-authorize';

export default {
  checkUnion,
};

// didLogin 代表是登录状态
function checkUnion(scene, { method, args, needLogin = false }) {
  return new Promise((resolve, reject) => {
    userInfoAuthorize.open({
      scene,
      platformCallback: {
        method,
        args,
      },
      needLogin,
    }).then(result => {
      resolve({ didLogin: result.hasLogin });
    }).catch(err => {
      reject(err);
    });
  });
}
