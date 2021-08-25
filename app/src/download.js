const fs = require('fs');
const compressing = require('compressing');
const http = require('http')
const AdmZip = require('adm-zip')
const path = require('path')

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
        console.log('download end');
      });

      // 进度、超时等
      file.on('finish', () => {
        console.log('finish write file')
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

const DOWNLOAD_FILE = [
  {
    id: 4910,
    name: 'wsc-h5-vis'
  },
  {
    id: 5075,
    name: 'wsc-pc-vis'
  },
  {
    id: 4947,
    name: 'wsc-pc-shop'
  },
  {
    id: 4949,
    name: 'wsc-pc-goods'
  },
  {
    id: 9989,
    name: 'wsc-pc-decorate'
  },
  {
    id: 4555,
    name: 'wsc-h5-shop'
  },
  {
    id: 4951,
    name: 'wsc-pc-ump'
  },
  {
    id: 9988,
    name: 'wsc-h5-decorate'
  },
  {
    id: 7388,
    name: 'wsc-h5-goods'
  }
]

module.exports = () => {
  return Promise.all(DOWNLOAD_FILE.map(item => downloadFile(getGitlabDownLink(item.id), item.name)))
}