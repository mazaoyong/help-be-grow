const fs = require('fs');
const compressing = require('compressing');
const http = require('http')
const AdmZip = require('adm-zip')
const path = require('path')
const { getConfig } = require('./dataGetter')
const chalk = require('chalk')

function downloadFile(uri, projectName) {
  const dest = path.join(__dirname, `../static-project/${projectName}.zip`)
  return new Promise((resolve, reject) => {
    // 确保dest路径存在
    const file = fs.createWriteStream(dest);

    http.get(uri, (res) => {
      if (res.statusCode !== 200) {
        reject(response.statusCode);
        return;
      }
      res.on('end', () => {
        // console.log(chalk.green(`${projectName} 下载完成`));
      });

      // 进度、超时等
      file.on('finish', () => {
        const zip = new AdmZip(dest);
        const zipEntries = zip.getEntries();
        // 版本号
        const version = zipEntries[0].entryName.toString().match(/master-(\S+)\//)[1]
        compressing.zip.uncompress(dest, path.join(__dirname, '../static-project/'))
          .then(res => {
            const projectPath = path.join(__dirname, '../static-project/', `${projectName}-master-${version}`)
            fs.renameSync(projectPath, path.join(__dirname, '../static-project/', projectName))
            resolve({
              name: projectName,
              version
            })
            file.close(resolve);
            console.log(chalk.green(`${projectName} 解压完成`))
          })
      }).on('error', (err) => {
        fs.unlink(dest);
        reject(err.message);
      })

      res.pipe(file);
    });
  });

}

// 根据项目id返回gitlab下载地址
function getGitlabDownLink(id) {
  return `http://gitlab.qima-inc.com/api/v4/projects/${id}/repository/archive.zip?private_token=s3sD8zFAiUj4p_R4886o`
}

module.exports = () => {
  return Promise.all(getConfig().map(item => downloadFile(getGitlabDownLink(item.id), item.name)))
}