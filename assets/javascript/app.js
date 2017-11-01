/* In this assignment, you'll create a train schedule application 
that incorporates Firebase to host arrival and departure data. 
Your app will retrieve and manipulate this information with Moment.js. 
This website will provide up-to-date information about various trains, 
namely their arrival times and how many minutes remain until they arrive at their station.
When adding trains, administrators should be able to submit the following:
Train Name
Destination 
First Train Time -- in military time
Frequency -- in minutes
Code this app to calculate when the next train will arrive; 
this should be relative to the current time.
Users from many different machines must be able to view same train times.
Styling and theme are completely up to you. Get Creative! */

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDnjBFkr5CMTSdr_uoXMDanfEuhqrU8vA0",
    authDomain: "my-awesome-project-3c50f.firebaseapp.com",
    databaseURL: "https://my-awesome-project-3c50f.firebaseio.com",
    projectId: "my-awesome-project-3c50f",
    storageBucket: "my-awesome-project-3c50f.appspot.com",
    messagingSenderId: "787838433067"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
//submit button to add new trains
 $("#submitbutton").on("click", function(event) {
//add new rows
	var newRow = $("<tr>");
	var newData = $("<td>")
//grab input values
	var newTrain = $("#train-input").val().trim();
	var newDestination = $("#destination-input").val().trim();
	var newFirstTrain = $("#first-train-input").val().trim();
	var newFrequency = $("#frequency-input").val().trim();

	console.log(newTrain);
	console.log(newDestination);
	console.log(newFirstTrain);
	console.log(newFrequency);

//push to firebase
  database.ref().push({
    train: newTrain,
    destination: newDestination,
    firstTrain: newFirstTrain,
    frequency: newFrequency
  
  });
   $("#train-input").val("");
        $("#destination-input").val("");
        $("#frequency-input").val("");
        $("#first-train-input").val("");
});



 database.ref().on("child_added", function(snapshot) {

    // find when the next train is and minutes until next train
  var frequency = snapshot.val().frequency;
  // pushed back 1 year to make sure it comes before current time
  var convertedDate = moment(snapshot.val().firstTrain, 'hh:mm').subtract(1, 'years');
  var trainTime = moment(convertedDate).format('HH:mm');
  var currentTime = moment();
  // pushed back 1 year to make sure it comes before current time
  var firstTimeConverted = moment(trainTime,'hh:mm').subtract(1, 'years');
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  
  var minutesAway = frequency - tRemainder;
  
  var nextTrain = moment().add(minutesAway, 'minutes').format('HH:mm')


      // Change the HTML
      var newRow = $("<tr>");

      newRow.append("<td>" + snapshot.val().train + "</td>");
      newRow.append("<td>" + snapshot.val().destination + "</td>");
      newRow.append("<td>" + snapshot.val().frequency + "</td>");
      newRow.append("<td>" + nextTrain + "</td>");
      newRow.append("<td>" + minutesAway + "</td>");

      $("#train-table").append(newRow);



    // Create Error Handling
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});