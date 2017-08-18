'use strict';

require('dotenv').load();

var API_KEY  = process.env.API_KEY,
    LIST_ID  = process.env.LIST_ID,
    STATUS   = process.env.STATUS;

var Mailchimp = require('mailchimp-api-v3') ;
var mailchimp = new Mailchimp(API_KEY);

console.log('Loading function');

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {

  var defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  console.log("Request: " + JSON.stringify(event));

  if (!event.body) {

    callback(null, {
      statusCode: '409',
      headers: defaultHeaders
    });

  }

  var body = JSON.parse(event.body);

  if (!body.email) {
    callback(null, {
      statusCode: '409',
      headers: defaultHeaders
    });
  }

  mailchimp.post({
    path: '/lists/' + LIST_ID + '/members',
    body: {
      email_address: body.email,
      status: STATUS
    }
  }, function(err, data) {

    var resp = err || data;
    var statusCode = err ? 500 : 200;

    callback(null, {
      statusCode: statusCode,
      headers: defaultHeaders,
      body: JSON.stringify(resp)
    });

  });

};
