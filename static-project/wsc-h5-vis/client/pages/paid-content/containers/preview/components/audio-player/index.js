import AudioPlayer from './AudioPlayer';

const imgs = require.context('./images', true, /\.svg$/);
imgs.keys().map(imgs);

export default AudioPlayer;
