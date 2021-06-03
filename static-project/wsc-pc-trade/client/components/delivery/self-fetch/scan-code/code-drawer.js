const yzUrl = 'https://img.yzcdn.cn/public_files/2018/06/21/8bd8cf0f57c7ffd381935c86b43edcd5.png';
class CodeDrawer {
  constructor(ctx, canvas, data, callback) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rante = canvas.height / 274;
    this.callback = callback;
    this.data = data;
    this.loadAllImage().then(() => {
      this.render();
      this.callback();
    });
  }
  loadAllImage() {
    return Promise.all([this.loadImage(this.data.imgUrl), this.loadImage(yzUrl)]).then(
      ([codeImage, yzImage]) => {
        this.codeImage = codeImage;
        this.yzImage = yzImage;
      },
    );
  }
  loadImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
    });
  }
  drawBackGround(ctx) {
    const c = this.canvas;
    const width = c.width;
    const height = c.height;
    const redHeight = (239 / 274) * height;
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#e00';
    ctx.fillRect(0, 0, width, redHeight);
    ctx.restore();
  }
  drawTopText(ctx) {
    const c = this.canvas;
    const width = c.width;
    const height = c.height;
    const rante = this.rante;
    const x = width / 2;
    const y = (18 / 274) * height;
    ctx.save();
    ctx.font = 16 * rante + 'px \u5FAE\u8F6F\u96C5\u9ED1';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.fillText('扫一扫提货', x, y);
    ctx.restore();
  }
  drawMultiStoreName(ctx) {
    const c = this.canvas;
    const width = c.width;
    const height = c.height;
    const rante = this.rante;
    const yFirst = (45 / 274) * height;
    const yLast = (59 / 274) * height;
    const x = width / 2;
    const name = this.data.name;
    const firstName = name.slice(0, 12);
    const lastName = name.slice(12);
    ctx.save();
    ctx.font = 10 * rante + 'px \u5FAE\u8F6F\u96C5\u9ED1';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.fillText(firstName, x, yFirst);
    ctx.fillText(lastName, x, yLast);
    ctx.restore();
  }
  drawQrcode(ctx) {
    const c = this.canvas;
    const width = c.width;
    const height = c.height;
    const rante = this.rante;
    const x = (30 / 189) * width;
    const y = (79 / 274) * height;
    const r = 129 * rante;
    ctx.save();
    ctx.drawImage(this.codeImage, x, y, r, r);
    ctx.restore();
  }
  drawBottomText(ctx) {
    const c = this.canvas;
    const width = c.width;
    const height = c.height;
    const rante = this.rante;
    const x = width / 2;
    const y = (215 / 274) * height;
    ctx.save();
    ctx.font = 10 * rante + 'px \u5FAE\u8F6F\u96C5\u9ED1';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.fillText(this.data.type, x, y);
    ctx.restore();
  }
  drawYouZan(ctx) {
    const c = this.canvas;
    const width = c.width;
    const height = c.height;
    const rante = this.rante;
    const x = (73 / 189) * width;
    const y = (246 / 274) * height;
    ctx.save();
    ctx.drawImage(this.yzImage, x, y, 44 * rante, 16 * rante);
    ctx.restore();
  }
  render() {
    const ctx = this.ctx;
    this.drawBackGround(ctx);
    this.drawTopText(ctx);
    this.drawMultiStoreName(ctx);
    this.drawQrcode(ctx);
    this.drawBottomText(ctx);
    this.drawYouZan(ctx);
  }
}

export default CodeDrawer;
