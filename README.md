### FEATURE0002
#### Request
Worker threads are used to process the requests. If the worker thread is idle i.e., any API haven't received the requests in last 15 minutes, it should be terminated. Generate a new worker when a new request comes.

Implement the logic to terminate the worker thread if it is idle for 15 minutes.
Create a new worker thread whenever a new request comes.
Log the worker thread termination and creation in the console.

#### Acceptance Criteria
- Worker thread should be terminated if it is idle for 15 minutes.
- Whenever a new request comes, a new worker thread should be created.
- Logs should be printed in the console for worker thread termination and creation.
- Explain the approach and document the list of files changed in the README.md

#### Approach
1. Begin tracking idle time in worker threads.
2. Terminate worker threads after 15 minutes.
3. When a new request arrives check if the worker thread is alive. Create a new one if needed.

#### Changes
- generateNewWorker.js
  - adds variable for tracking idle time
  - adds function for resetting the idle time which terminates the worker on expiration
  - makes worker a variable so we can inspect an manipulate it as needed
  - adds logging for instances in normal and error cases when worker is terminated
  - adds logging for when new worker threads are created
- index.js
  - Uses factory instead of direct object reference to worker generators.
  - All requests now use the worker factory to get/create a worker thread when called.


### FEATURE0001
#### Request
Add correlationId header to all the requests and response
In order to track the requests, we would need a correlationId header in all the requests and response.

Validate every incoming request 
Since the users of the API can pass correlationId header, if its passed use that, else generate a new id
Add the correlationId header to response headers as well.
Document the list of files changed in the README.md.
#### Acceptance Criteria
All the requests and response should have correlationId header.
#### Changes
- package.json
  - Added dependency on uuid package.
- index.js
  - import uuid package
  - add preHandler hook to check if correlationId exists in the header, creating it if not.
  - update /getCatsInfo to add and use the correlationId in the response instead of the request id.
  - update /getDogsInfo to add and use the correlationId in the resposne instead of the request id.
#### TODOs
- Add test for basic request/response to make sure it has the correct headers whether passed by the user or not.


### BUG0001
#### Customer States
"The getCatsInfo API works fine for the first few requests, but after a few requests, it stops responding."
#### Recreate
Go to localhost:3000/getCatsInfo and let it sit for a few seconds, then try to refresh the page. Alternatively, you 
could refresh the page until it stops responding, but that is just to give you something to do.
#### Cause
setTimeout in generateToken makes the function run every 5 seconds. It is never cleared, so this continues to run 
infinitely. 
#### Fix
Clear the timeout. When to do this depends on the lifecycle of the worker.  
- If the worker thread is just one request, we can clear it in handleMessage.
- If the worker thread is expected to do more than one request, we would need to introduce a little more logic to clear
the timeout when the worker is about to exit.
While the later is more complex, it is also more future proof.
#### Changes
- getCatsWorker.js
  - Variable added to track the timeout id for the worker.
  - generateToken function updated to to set the timeout id from the setTimeout call
  - handleMessage function updated to clear the timeout id before generating a new token.
  - parentPort.on('close') added to clear the timeout when the worker exits.
#### ToDos
- Add test to ensure no regression.
