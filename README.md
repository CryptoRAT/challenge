
### BUG0001
#### Customer States:
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