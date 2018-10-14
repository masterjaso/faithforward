var workMaster = require('cluster');
var os = require('os');

workMaster
  .on('fork', (worker) => {
    console.log(`Forked worker: ${worker.id} as PID: ${worker.process.pid}`);
  })
  .on('listening', (worker, addr) => {
    console.log(`Worker ${worker.id} listening on ${addr.address}:${addr.port}`);
  })
  .on('online', (worker) => {
    console.log(`Worker ${worker.id} is online`)
  })
  .on('disconnect', (worker) => {
    console.log(`The worker ${worker.id} has disconnected`);
  })
  .on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died via ${code} with signal ${signal}`);
  })
  .on('message', msgHandler);

workMaster.setupMaster({
  exec: 'src/Worker.js',
  args: [],
  silent: false
});

for(var i = 0; i < os.cpus().length; i++){
  workMaster.fork();
}

function msgHandler(worker, msg, handle){

}