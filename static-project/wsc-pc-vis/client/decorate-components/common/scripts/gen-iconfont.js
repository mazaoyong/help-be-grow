/**
 * 生成 icon-font 的脚本。勿用
 */

/* eslint-disable no-console */
/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const webfont = require('webfont').default;
const chalk = require('chalk');
const shell = require('shelljs');
const types = ['css', 'svg', 'eot', 'ttf', 'woff', 'woff2'];
const iconsPath = path.join(__dirname, '../assets/icons/*.svg');
const destPath = path.join(__dirname, '../assets/fonts');
const templatePath = path.join(__dirname, './icon-font-template.css.njk');
const cssPath = path.join(__dirname, '../icon/style/_index.scss');
const { log } = console;

// 是否需要上传 cdn
const shouldUploadCDN = process.argv.slice(2).indexOf('cdn') > -1;

// 清除目标目录
const cleanDestDir = () => {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath);
    return;
  }

  fs.readdirSync(destPath).forEach(filePath => {
    const realPath = path.resolve(destPath, filePath);
    fs.statSync(realPath).isFile() && fs.unlinkSync(realPath);
  });
};

// 生成字体文件
const writeFontFiles = data => {
  return types.map(type => {
    let filePath = cssPath;

    if (type === 'css') {
      fs.writeFileSync(filePath, data.template);
    } else {
      filePath = path.join(destPath, `./decorate-icon.${type}`);

      if (type === 'svg') {
        fs.writeFileSync(filePath, data.svg);
      } else {
        fs.writeFileSync(filePath, new Buffer(data[type].buffer));
      }
    }

    return filePath;
  });
};

// 计算文件哈希
const calcHash = filePath => {
  const md5 = crypto.createHash('md5');
  md5.update(fs.readFileSync(filePath));

  return md5.digest('hex');
};

// 用哈希值来重命名文件
const renameFiles = filePaths => {
  return filePaths.map(filePath => {
    // 不需要给样式文件打 hash
    if (filePath.endsWith('css')) {
      return filePath;
    }

    const newFilePath = filePath.replace(/(.*\/)(.*)(\..*)$/, (match, p1, p2, p3) => {
      return `${p1}${calcHash(filePath)}${p3}`;
    });
    fs.renameSync(filePath, newFilePath);

    return newFilePath;
  });
};

// 上传 cdn
const cdn = () => {
  shell.exec(`superman-cdn showcase/decorate/icons ${destPath}/*.*`, err => {
    if (!err) {
      log();
      log(chalk.green('🤓 Upload icon-font done.'));
    }
  });
};

log(chalk.blue('🤔  Start generate icon-font...'));

webfont({
  files: iconsPath,
  fontName: 'decorate-icon',
  template: templatePath,
  templateClassName: 'deco-icon',
  centerHorizontally: true,
  normalize: true,
})
  .then(res => {
    cleanDestDir();
    return writeFontFiles(res);
  })
  .then(filePaths => {
    return shouldUploadCDN ? renameFiles(filePaths) : filePaths;
  })
  .then(filePaths => {
    log(chalk.green('🤓  Generate icon-font success.'));
    log(filePaths.join('\n'));
    log();
  })
  .then(() => {
    if (shouldUploadCDN) {
      log(chalk.blue('🤔  Start upload icon-font to cdn...'));
      cdn();
    }
  })
  .catch(err => {
    log(chalk.red('😣  Generate icon-font fail.\n'));
    log(err);
  });
