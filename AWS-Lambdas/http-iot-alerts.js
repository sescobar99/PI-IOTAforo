'use strict';
var AWS = require('aws-sdk');
var alertThreshold1 = 0.5;
var alertThreshold2 = 0.8;

exports.handler = function (event, context, callback) {
    var iotdata = new AWS.IotData({ endpoint: "alal4hcl2fp3w-ats.iot.us-east-2.amazonaws.com" });
    // console.info(event);
    event.Records.forEach((record) => {
        //Uncomment for debuging
        /*
            var paramsdebug = {
                topic: 'debug',
                payload: JSON.stringify(record),
                qos: 0
            };

            iotdata.publish(paramsdebug, function (err, data) {
                if (err) {
                    console.log("Error occured : ", err);
                }
                else {
                    console.log("success.....");
                }
            });
        */
        /*
            console.log(record.dynamodb);
            console.log(record.dynamodb.NewImage.payload);
            if (typeof record.dynamodb.NewImage == undefined) {
                console.log()
            };
            if (true) {
                return;
            }
         */
        if (record.eventName == 'MODIFY' || record.eventName == 'INSERT') {
            // console.log(record);
            // console.log(record.dynamodb);
            // console.log(record.dynamodb.NewImage);
            //check fields existance
            const placeData = [typeof record.dynamodb.NewImage.full_occupancy, typeof record.dynamodb.NewImage.threshold, typeof record.dynamodb.NewImage.payload];
            let message;
            let block = record.dynamodb.NewImage.block.S;
            let room = record.dynamodb.NewImage.room.S;
            if (placeData.includes("undefined")) { //Required data not in db
                message = {
                    alert_level: -1,
                    alert_message: "Room info not added in db",
                };
                // console.info("Room info not added in db");
            }
            else {
                let threshold;
                if (typeof record.dynamodb.NewImage.threshold.N === "undefined") {
                    threshold = parseFloat(record.dynamodb.NewImage.threshold.S);
                }
                else {
                    threshold = parseFloat(record.dynamodb.NewImage.threshold.N);
                }

                let full_occupancy;
                if (typeof record.dynamodb.NewImage.full_occupancy.N === "undefined") {
                    full_occupancy = parseFloat(record.dynamodb.NewImage.full_occupancy.S);
                }
                else {
                    full_occupancy = parseFloat(record.dynamodb.NewImage.full_occupancy.N);
                }

                let actual_occupancy = parseFloat(JSON.parse(record.dynamodb.NewImage.payload.S).actual_occupancy);
                let occupancy_ratio = (actual_occupancy / full_occupancy);


                let ratioLevel1 = threshold * alertThreshold1;
                let ratioLevel2 = threshold * alertThreshold2;
                let alert_level = 0;

                if (occupancy_ratio >= ratioLevel2) {
                    alert_level = 2;
                }
                else if (occupancy_ratio >= ratioLevel1) {
                    alert_level = 1;
                }

                message = {
                    // actual_occupancy: actual_occupancy,
                    // full_occupancy: full_occupancy,
                    // occupancy_ratio: occupancy_ratio ,
                    // threshold: threshold,
                    // ratio_level_1 : ratioLevel1,
                    // ratio_level_2 : ratioLevel2 ,
                    alert_level: alert_level,
                };

            }

            var params = {
                topic: 'alerts/' + block + '/' + room,
                payload: JSON.stringify(message),
                qos: 0
            };

            iotdata.publish(params, function (err, data) {
                if (err) {
                    console.log("Error occured : ", err);
                }
                else {
                    console.log("success.....");
                }
            });
        }
    });

    callback();

};