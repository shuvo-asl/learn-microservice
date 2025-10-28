## Issues #01
## Problem: when sending a POST request with JSON body to /api/v1/auth/, it hangs and doesn’t work
The mentioned problem is a known gotcha with http-proxy-middleware + express.json().

Let’s go step-by-step 👇

🧩 The Root Cause

The issue happens because:

You used app.use(express.json()) before the proxy middleware.

That means Express consumes (reads) the request body stream to parse JSON and populate req.body.

But when the request reaches the proxy middleware, the original raw body stream is already consumed, and the proxy cannot forward it to the target service.

As a result, the proxy hangs indefinitely, since the target never receives the expected request body.