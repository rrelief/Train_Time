/* global firebase moment */

//First I need to initialize Firebase
var config = {
    apiKey: "AIzaSyCzq41NWb9BLdrnXU8jAQv6IWt2-jsLfKc",
    authDomain: "train-time-bitches.firebaseapp.com",
    databaseURL: "https://train-time-bitches.firebaseio.com",
    projectId: "train-time-bitches",
    storageBucket: "train-time-bitches.appspot.com",
    messagingSenderId: "552216946206"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Next I need to add functionality to submit button on html for adding train schedules + update the database
  $("#add-train-btn").on("click", function(event){
      event.preventDefault();

      // Need to add variables to collect user inputs
      var trainName = $("#train-name-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var trainFrequency = moment($("#frequency-input").val().trim(),'mm').format('mm');
      var trainStart = moment($("#start-input").val().trim(), 'HH:mm').format('HH:mm');

      // Creates local "temporary" object for holding train data
      var newTrain = {
          name: trainName,
          destination: trainDestination,
          frequency: trainFrequency,
          start: trainStart
      };

      //uploads train data to the database
      database.ref().push(newTrain);

      // logs everything into the console
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.frequency);
      console.log(newTrain.start);

      //add an alert to notify user train was added successfully
      alert("Your Train was added successfully!")

      //Of course you have to clear all of the text boxes
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#frequency-input").val("");
      $("#start-input").val("");

      // 3. Create Firebase event for adding new train schedule to the firebase database and dynamically create row in html after user click submit button
      database.ref().on("child_added", function(childSnapshot, prevChildKey) {
          
        console.log(childSnapshot.val());
        // Store everything into a variable.
          var trainName = childSnapshot.val().name;
          var trainDestination = childSnapshot.val().destination;
          var trainFrequency = childSnapshot.val().frequency;
          var trainStart = childSnapshot.val().start;

          // Train Info
          console.log(trainName);
          console.log(trainDestination);
          console.log(trainFrequency);
          console.log(trainStart);

          // Put the train start time to unix
          var firstTrain = moment(childSnapshot.val().trainStart,"HH:mm").format('X');

          //caluculates the difference between the first train and the current time
          var difference = moment().diff(moment.unix(firstTrain),"minutes");

          //calculates the times the train has arrived from first to now
          var timeLeft = moment().diff(moment.unix(firstTrain), "minutes") %trainFrequency;

          // calculates the amount of minutes left
          var mins = moment(trainFrequency - timeLeft, "mm").format('mm');

          //adds minutes to last arrival for next arrival
          var nextTrain = moment().add(mins,"m").format("HH:mm");


          // Add each train's data into the table
          $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
              firstTrain + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + mins + "</td></tr>");
      });


  });