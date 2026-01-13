# real-time-fraud
Just made a real time fraud detection pipeline using AWS, 
using Eventbrite to trigger lambda function for generating pseudo transactions,
detecting fraud and scoring them,
they work together using SQS and further notify the user using SNS in clasification on level of fraud transactions
further planning to work into banking system the fraud transaction scored as CRITICAL will be triggering bank freeze to prevent transaction. 
