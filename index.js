const fs = require("fs");

var tableRequests = JSON.parse(fs.readFileSync("interview_data.json"));

var acceptedReservations = [];
var rejectedReservations = [];

// each index of the arrays is a time and its value is the number of people seated
// tableA[2] = 4   -> at time 2 there are 4 people seated at table A
var tableA = new Array(26).fill(0);
var tableB = new Array(26).fill(0);
var tableC = new Array(26).fill(0);

function tryTable(table, request){ // helper function to check if a request fits a table, returns true if yes, false if no
    var startTime = request.startTime;
    var endTime = startTime + request.duration - 1;

    //first check if you can take the request
    for(var i = startTime; i <= endTime; i++){
        var seatsAvailable = 4 - table[i];
        if(seatsAvailable < request.numberOfPeople){ // if there aren't enough seats
            return false;
        }
    }

    //if the request was okay, then actually fill the seats
    for(var i = startTime; i <= endTime; i++){
        var seatsAvailable = 4 - table[i];
        table[i] = table[i] + request.numberOfPeople;
    }
    return true;
}

tableRequests.sort((a,b) => a.receivedTime - b.receivedTime); //sort requests by receivedTime

for(var i = 0; i < tableRequests.length; i++){
    var requestID = tableRequests[i].requestID;
    
    // first check table A, then table B, then table C
    if(tryTable(tableA, tableRequests[i]) || tryTable(tableB, tableRequests[i]) || tryTable(tableC, tableRequests[i])){
        acceptedReservations.push(requestID);
    }else{
        rejectedReservations.push(requestID);
    }
}
console.log("Accepted request IDs: ", acceptedReservations);
console.log("Rejected request IDs: ", rejectedReservations);