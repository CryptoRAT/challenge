const { Worker } = require('worker_threads');
const path = require('path');
const requestTracker = require('./requestTracker');

const generateNewWorker = (workerName) => {
  console.log(`Generating new worker ${workerName}`);
  let worker = new Worker(path.join(__dirname, '../workers', workerName));
  let idleTimeoutId;
  // Function to reset idle timeout
  const resetIdleTimeout = () => {
    if (idleTimeoutId) {
      clearTimeout(idleTimeoutId);
    }
    idleTimeoutId = setTimeout(() => {
      console.log(`Terminating idle worker: ${workerName}`);
      worker.terminate();
      worker = null;
    }, 15 * 60 * 1000); // 15 minutes
  }

  // Reset idle timeout on message receipt
  worker.on('message', (data) => {
    const { response, requestId } = data;
    requestTracker[requestId](response);
    delete requestTracker[requestId];
    resetIdleTimeout(); // Reset idle timeout after each request
  });

  worker.on('error', () => {
    console.error(`Worker error: ${workerName}`, error);
    worker.terminate();
    worker = null;
  });

  resetIdleTimeout();
  return worker;
}

module.exports = generateNewWorker;