# real-time-fraud

Simple producer that generates fake transaction events and (optionally) sends them to AWS SQS.

Usage
- Install dependencies: `npm install`
- Dry-run (no AWS credentials required):
  - `npm run run-once` or `node producer.js --once`
- Start producing every 2 seconds (set `SQS_QUEUE_URL` and AWS credentials to send):
  - `SQS_QUEUE_URL=<your-queue-url> npm start`

Notes
- This uses the AWS SDK v2. Consider migrating to v3 if you plan to maintain the project long-term.
- Do not commit AWS credentials. Use environment variables, AWS profiles, or a secrets manager.
