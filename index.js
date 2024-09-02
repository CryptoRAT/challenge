const fastify = require('fastify')({ logger: true, connectionTimeout: 5000 });
const { v4: uuid } = require('uuid');
const generateNewWorker = require('./utils/generateNewWorker');
const requestTracker = require('./utils/requestTracker');

const getCatsWorker = generateNewWorker('getCatsWorker');
const getDogsWorker = generateNewWorker('getDogsWorker');


/*
- PreHandler hook to validate and manage correlationId
 */
fastify.addHook('preHandler', (request, reply, done) => {
  let correlationId = request.headers['correlationid']; // Case-insensitive header access

  if (!correlationId) {
    correlationId = uuid(); // Generate a new ID if not provided
  }

  // Attach the correlationId to the request object for further use
  request.correlationId = correlationId;

  // Set the correlationId in the response headers
  reply.header('correlationId', correlationId);

  done();
});

fastify.get('/getCatsInfo', function handler (request, reply) {
  requestTracker[request.correlationId] = (result) => reply.send(result);
  getCatsWorker.postMessage({ requestId: request.correlationId});
})

fastify.get('/getDogsInfo', function handler (request, reply) {
  requestTracker[request.correlationId] = (result) => reply.send(result);
  getDogsWorker.postMessage({ requestId: request.correlationId });
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
