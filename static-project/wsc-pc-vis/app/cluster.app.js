/* eslint-disable no-console */
const cluster = require('cluster');
const numCPUs = process.env._NUM_CPUS || require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('listening', function(worker, address) {
    console.log(
      'listening: worker ' +
        worker.process.pid +
        ', Address: ' +
        address.address +
        ':' +
        address.port
    );
  });

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log(
      'Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  require('./app.js');
}
