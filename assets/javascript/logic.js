$(document).ready(function() {
// GLOBAL VARIABLES
// ===============================================================================
    var trainName = "";
    var destination = "";
    var firstTrain = 0e;
    var frequency = "";
    var firstTrainConverted = "";
    var currentTime = "";
    var diffTime = "";
    var tRemainder = "";
    var tMinutesTillTrain = "";
    var nextTrain = "";
    var nextTrainFormatted = "";
    var config = {
        apiKey: "AIzaSyBo1OsAs9shOTmZa3v0VfcaQd2equMjtz0",
        authDomain: "timesheet-2839c.firebaseapp.com",
        databaseURL: "https://timesheet-2839c.firebaseio.com",
        projectId: "timesheet-2839c",
        storageBucket: "timesheet-2839c.appspot.com",
        messagingSenderId: "140042084210"
      };
      firebase.initializeApp(config);


// FUNCTIONS
// ===============================================================================
// var timeCalculations = function (){
//     firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
//     currentTime = moment();
//     diffTime = moment().diff(moment(firstTrainConverted), "minutes");
//     tRemainder = diffTime % frequency;
//     tMinutesTillTrain = frequency - tRemainder;
//     nextTrain = moment().add(tMinutesTillTrain, "minutes");
//     nextTrainFormatted = moment(nextTrain).format("HH:mm");
// }

// PROCESS
// ===============================================================================
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();
    
        
        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrain = $("#first-train-input").val().trim();
        frequency= $("#frequency-input").val().trim();

        firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        tRemainder = diffTime % frequency;
        tMinutesTillTrain = frequency - tRemainder;
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrainFormatted = moment(nextTrain).format("HH:mm");

        // timeCalculations();
        database.ref().push({
            name: trainName,
            destination: destination,
            firstTime: firstTrain,
            frequency: frequency
        });

    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

        // testing
        console.log(moment());
        console.log(trainName + destination + firstTrain + frequency);
        console.log(firstTrainConverted);
        console.log(currentTime);
        console.log(nextTrain);
    });

    database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

        var updateButton = $("<button>").html("<span class='glyphicon glyphicon-edit'></span>").addClass("updateButton").attr("data-index", index).attr("data-key", childSnapshot.key);
        var removeButton = $("<button>").html("<span class='glyphicon glyphicon-remove'></span>").addClass("removeButton").attr("data-index", index).attr("data-key", childSnapshot.key);
  
      var firstTime = childSnapshot.val().firstTime;
      var tFrequency = parseInt(childSnapshot.val().frequency);
      var firstTrain = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTrain);
      console.log(firstTime);
      var currentTime = moment();
      var currentTimeCalc = moment().subtract(1, "years");
      var diffTime = moment().diff(moment(firstTrain), "minutes");
      var tRemainder = diffTime%tFrequency;
      var minutesRemaining = tFrequency - tRemainder;
      var nextTRain = moment().add(minutesRemaining, "minutes").format ("hh:mm A");
      var beforeCalc = moment(firstTrain).diff(currentTimeCalc, "minutes");
      var beforeMinutes = Math.ceil(moment.duration(beforeCalc).asMinutes());
  
      if ((currentTimeCalc - firstTrain) < 0) {
        nextTrain = childSnapshot.val().firstTime;
        console.log("Before First Train");
        minutesRemaining = beforeMinutes;
      }
      else {
        nextTrain = moment().add(minutesRemaining, "minutes").format("hh:mm A");
        minutesRemaining = tFrequency - tRemainder;
        console.log("Working");
      }
  
  
        var newRow = $("<tr>");
      newRow.addClass("row-" + index);
        var cell1 = $("<td>").append(updateButton);
        var cell2 = $("<td>").text(childSnapshot.val().name);
        var cell3 = $("<td>").text(childSnapshot.val().destination);
        var cell4 = $("<td>").text(childSnapshot.val().frequency);
        var cell5 = $("<td>").text(nextTrain);
        var cell6 = $("<td>").text(minutesRemaining);
        var cell7 = $("<td>").append(removeButton);
  
        newRow
            .append(cell1)
            .append(cell2)
            .append(cell3)
            .append(cell4)
            .append(cell5)
            .append(cell6)
            .append(cell7);
  
       $("#tableContent").append(newRow);
  
     index++;
        
    }, function (error) {
  
        alert(error.code);
  
    });
});