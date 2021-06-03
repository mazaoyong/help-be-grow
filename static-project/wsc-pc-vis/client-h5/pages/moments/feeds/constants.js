const STATIC_ASSETS = {
  backgroundImage: 'https://b.yzcdn.cn/public_files/4ba197b21a2de76c8f48d7bf0879ca0e.jpg',
  userAvatar: 'https://b.yzcdn.cn/public_files/8c652f93e24858f0b4bd80d351279b51.png',
  errorIcon: 'https://b.yzcdn.cn/public_files/2019/09/23/b0fbc7d61c18c0cf2a32d5abc70a23ef.png',
  wechatIcon: 'https://img01.yzcdn.cn/public_files/2019/09/26/426f909d6f1642b0f9fd81638f075bfa.png',
  downloadIcon: 'https://img01.yzcdn.cn/public_files/2019/09/26/51ca17583516bb20b8ad744f09172a5c.png',
};

const shareTypeOptions = [
  {
    value: 1,
    text: '生成海报',
    onClick: function() {
      window.location.href = `${_global.url.v4}/vis/h5/edu/moments/poster?postId=${this.currentPost.postId}`;
    },
  },
  {
    value: 0,
    text: '取消',
    onClick: function() {
      this.showShare = !this.showShare;
    },
  },
]; // 0: 取消, 1: 生成海报

export default {
  STATIC_ASSETS,
  shareTypeOptions,
};
