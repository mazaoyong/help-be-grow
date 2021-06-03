const path = require('path');
const fs = require('fs');

const res = fs.readdirSync(path.resolve(__dirname), 'utf8');

console.log(res.length);
