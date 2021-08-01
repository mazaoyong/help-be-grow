const fs = require('fs');
const compressing = require('compressing');
const http = require('http')
const AdmZip = require('adm-zip')

function downloadFile(uri, dest) {
  // var zip = new AdmZip(dest);
  // var zipEntries = zip.getEntries();
  // zipEntries.forEach(function (zipEntry) {
  //   console.log(zipEntry.toString()); // outputs zip entries information
  // });
  // compressing.tgz.uncompress(dest, './')
  //   .then(res => {
  //     console.log(res)
  //   })
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
        file.close(resolve);
      }).on('error', (err) => {
        fs.unlink(dest);
        reject(err.message);
      })

      res.pipe(file);
    });
  });

}

// downloadFile("http://gitlab.qima-inc.com/api/v4/projects/5075/repository/archive.zip?private_token=s3sD8zFAiUj4p_R4886o", './master.zip')
downloadFile("http://gitlab.qima-inc.com/api/v4/projects/4910/repository/archive.zip?private_token=s3sD8zFAiUj4p_R4886o", './master.zip')