// 根据昵称和手机号生成下拉菜单客户文案
export const optionTextGen = ({ name, nickName, mobile }) => {
  if (name || nickName || mobile) {
    if (name) {
      return name + (mobile && `(${mobile})`);
    } else if (nickName) {
      return nickName + (mobile && `(${mobile})`);
    }
    return mobile;
  }
};
