const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
// Default to the queue URL you provided; allow override with SQS_QUEUE_URL env var
const DEFAULT_QUEUE_URL = 'https://sqs.us-east-2.amazonaws.com/915198917063/fraud-transactions-queue';
const QUEUE_URL = process.env.SQS_QUEUE_URL || DEFAULT_QUEUE_URL;

function generateTransaction() {
  return {
    transaction_id: uuidv4(),
    user_id: `user_${Math.ceil(Math.random() * 5)}`,
    amount: parseFloat((Math.random() * 2000).toFixed(2)),
    merchant: ['Amazon', 'Walmart', 'Apple', 'Uber', 'Starbucks'][Math.floor(Math.random() * 5)],
    timestamp: new Date().toISOString(),
    location: ['CA', 'NY', 'TX', 'ON', 'BC'][Math.floor(Math.random() * 5)]
  };
}

async function sendToQueue(dryRun = false) {
  const transaction = generateTransaction();
  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(transaction)
  };

  // Basic credentials check — avoid attempting to send if AWS credentials are not configured
  const hasAwsCreds = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
  if (dryRun || !hasAwsCreds) {
    console.log('[dry-run] Generated message (not sent):', transaction, { queuedFor: QUEUE_URL });
    if (!hasAwsCreds) console.log('[info] AWS credentials not found in env — set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to send.');
    return;
  }

  try {
    const res = await sqs.sendMessage(params).promise();
    console.log('Sent:', transaction, 'MessageId:', res.MessageId);
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

function start(intervalMs = 2000) {
  // send immediately then on interval
  sendToQueue(QUEUE_URL === 'YOUR_SQS_QUEUE_URL');
  return setInterval(() => sendToQueue(false), intervalMs);
}

if (require.main === module) {
  const once = process.argv.includes('--once');
  if (once) {
    sendToQueue(QUEUE_URL === 'YOUR_SQS_QUEUE_URL');
  } else {
    start(2000);
  }
}

module.exports = { generateTransaction, sendToQueue, start };
