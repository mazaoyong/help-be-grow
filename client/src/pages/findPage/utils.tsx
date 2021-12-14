export const getCodeUrl = (item:any) => {
  const codeUrl = `https://gitlab.qima-inc.com/wsc-node/${item.split('/')[0]}/-/blob/master/${item.split('/').slice(1).join('/')}`
  return codeUrl
}

export const getUID = () => {
  const uid = window.localStorage.getItem('uid');
  if (uid) {
    return uid;
  }
  const random = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
  window.localStorage.setItem('uid', random);
  return random;
}
