const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const awsConfig = {
  region: 'us-east-2',
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

router.get('/users', (req, res) => {
    const params = {
      TableName: table,
    };
    // Scan return all items in the table
    dynamodb.scan(params, (err, data) => {
      if (err) {
        res.status(500).json(err); // an error occurred
      } else {
        res.json(data.Items);
      }
    });
  });

// get thoughts from a user
// get thoughts from a user
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  const params = {
    TableName: table,
    KeyConditionExpression: "#un = :user",
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
      "#img": "image"    // add the image attribute alias
    },
    ExpressionAttributeValues: {
      ":user": req.params.username
    },
    ProjectionExpression: "#un, #th, #ca, #img", // add the image to the database response
    ScanIndexForward: false  // false makes the order descending(true is default)
  };
  // database call ..
    dynamodb.query(params, (err, data) => {
      if (err) {
        console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
        res.status(500).json(err); // an error occurred
      } else {
        console.log('Query succeeded.');
        res.json(data.Items);
      }
    });
  }); // closes the route for router.get(users/:username)

// Create new user
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      username: req.body.username,
      createdAt: Date.now(),
      thought: req.body.thought,
      image: req.body.image  // add new image attribute
    }
  };
  // ... database call


    dynamodb.put(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to add item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
        res.status(500).json(err); // an error occurred
      } else {
        console.log('Added item:', JSON.stringify(data, null, 2));
        res.json({ Added: JSON.stringify(data, null, 2) });
      }
    });
  }); // ends the route for router.post('/users')

  

  module.exports = router;