/**
 * 随机头像抽取，copied from wsc-h5-components: trade-carousel
 */

const domain = 'https://b.yzcdn.cn';

const avatars = [
  `${domain}/public_files/2019/09/18/22937c08bd4d87c2a33a339d81d5b58d.png`,
  `${domain}/public_files/2019/09/18/37aeb661064b029f2b0a86e9e662cbbb.png`,
  `${domain}/public_files/2019/09/18/535045098ea80c44f817c394b1ecfd10.png`,
  `${domain}/public_files/2019/09/18/0791652b22657b3c20ef0a0652a2f444.png`,
  `${domain}/public_files/2019/09/18/67e895423d5bdb9b59a6964dab8eb135.png`,
  `${domain}/public_files/2019/09/18/a4c29bd2591feaf04b93527ada157382.png`,
  `${domain}/public_files/2019/09/18/50db0df2db90833d3e11a9218be4c8d1.png`,
  `${domain}/public_files/2019/09/18/ab1159007d8a8f00449dec9087273268.png`,
  `${domain}/public_files/2019/09/18/0495a6dd1093f73ab38fde0aa70797de.png`,
  `${domain}/public_files/2019/09/18/5861386126c55a5d9b20c6c2c20a7013.png`,
  `${domain}/public_files/2019/09/18/da6c575bba1628eed578ceaaf1c1f5d4.png`,
  `${domain}/public_files/2019/09/18/99f7591d776795e25d439716f4dba2ff.png`,
  `${domain}/public_files/2019/09/18/0fedd48ac49d19c93303961d3255e7a5.png`,
  `${domain}/public_files/2019/09/18/95173169f85f61278cbdd75701770be7.png`,
  `${domain}/public_files/2019/09/18/02c643189e12d4aecb4f2a43d4c7e16e.png`,
  `${domain}/public_files/2019/09/18/36119d0107c34d145afcc689b68b21c6.png`,
  `${domain}/public_files/2019/09/18/da11ffc166308a8160527ecba9199ec1.png`,
  `${domain}/public_files/2019/09/18/aaedf80b686fe1511195a1622c45c719.png`,
  `${domain}/public_files/2019/09/18/0ccdc0f021b0a5d09b88db047dd432b4.png`,
  `${domain}/public_files/2019/09/18/9101a5fe88ace0ae861e95ff34f28957.png`,
  `${domain}/public_files/2019/09/18/c3998a48d5f8744b744e3e369666e63b.png`,
  `${domain}/public_files/2019/09/18/a72ce0a19a7fc19a1921e891f25ee59f.png`,
  `${domain}/public_files/2019/09/18/16cdb32d9829b387fe7a7ef0bb73024c.png`,
  `${domain}/public_files/2019/09/18/7c49758d28f9e20de19f3e78e585563d.png`,
  `${domain}/public_files/2019/09/18/650656080d028b5de05d8dccc789b278.png`,
  `${domain}/public_files/2019/09/18/1f35ff9cc78049054d398e09118b8192.png`,
  `${domain}/public_files/2019/09/18/8669c369899c8b804beca697ab07bdc0.png`,
  `${domain}/public_files/2019/09/18/e443c5c6df53f5db7708dc4122f32dc6.png`,
  `${domain}/public_files/2019/09/18/7655db43b1d509595183898b60568f09.png`,
  `${domain}/public_files/2019/09/18/aae85930a06d8598146dc79c2f4f415f.png`,
];

function randomNum(num = 0) {
  return Math.round(Math.random() * num);
}

export const getRandomAvatar = () => {
  return avatars[randomNum(avatars.length - 1)];
};
