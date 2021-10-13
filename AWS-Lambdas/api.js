const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      //   case "DELETE /items/{id}":
      //     await dynamo
      //       .delete({
      //         TableName: "occupancyDB",
      //         Key: {
      //           id: event.pathParameters.id
      //         }
      //       })
      //       .promise();
      //     body = `Deleted item ${event.pathParameters.id}`;
      //     break;
      case "GET /items":
        body = await dynamo.scan({ TableName: "occupancyDB" }).promise();
        break;

      case "GET /items/{block}":
        body = await dynamo
          .query({
            TableName: "occupancyDB",
            KeyConditionExpression: "#block = :b",
            ExpressionAttributeNames: { "#block": "block" },
            ExpressionAttributeValues: {
              ':b': event.pathParameters.block,
            }
          })
          .promise();
        break;

      case "GET /items/{block}/{room}":
        body = await dynamo
          .query({
            TableName: "occupancyDB",
            KeyConditionExpression: "#block = :b AND #room = :r",
            ExpressionAttributeNames: { "#block": "block", "#room": "room" },
            ExpressionAttributeValues: {
              ':b': event.pathParameters.block,
              ':r': event.pathParameters.room
            },
          })
          .promise();
        break;

      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "occupancyDB",
            Item: {
              block: requestJSON.block,
              room: requestJSON.room,
              full_occupancy: requestJSON.full_occupancy,
              threshold: requestJSON.threshold,
              payload: requestJSON.payload,
            }
          })
          .promise();
        body = `Put item ${requestJSON.block} ${requestJSON.room}`;
        break;

      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  }
  catch (err) {
    statusCode = 400;
    body = err.message;
  }
  finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};