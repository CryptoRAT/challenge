
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
