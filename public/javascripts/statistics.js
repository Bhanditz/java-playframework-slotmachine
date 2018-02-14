var google;
var avg;
var totalCreditsBet;
var totalCreditsWon;
var totalLosses;
var totalWins;
window.onload = function () {
    //Adding CDNs in the window.onload method ensures the initialization each time the page is refreshed
    //Using jQuery method getScript to load Firebase SDK
    $.getScript('https://www.gstatic.com/firebasejs/4.8.0/firebase.js', function () {
        // Initializing Firebase with User credentials
        var config = {
            apiKey: "AIzaSyC-TUeihAdQzg8Bjv70et_hYFLka4EA5kk",
            authDomain: "slot-machine-web-app.firebaseapp.com",
            databaseURL: "https://slot-machine-web-app.firebaseio.com",
            projectId: "slot-machine-web-app",
            storageBucket: "slot-machine-web-app.appspot.com",
            messagingSenderId: "79493939550"
        };
        firebase.initializeApp(config);
        //Gets a reference to the Firebase Realtime Database
        database = firebase.database();
        //Realtime Listener which checks for user login activity
        firebase.auth().onAuthStateChanged(function (currUser) {
            if (currUser) {
                //Splits logged in user's email to get the name
                var currUserName = currUser.email.substring(0, currUser.email.lastIndexOf("@"));
                var statisticsHeader = document.getElementById("statistics-header");
                statisticsHeader.innerHTML += " | " + currUserName;
            }
            else {
                window.location.href = "/"; //Prevents users from typing the URL entry point to access the game
                // without logging into an account
            }
        });
        var statisticsObj = new Statistics();
        statisticsObj.generateStatisticsLabels();
        statisticsObj.drawVictoryCountChart();
        statisticsObj.drawBetChart();
    });
    //Using jQuery method getScript to load Google Charts SDK
    $.getScript('https://www.gstatic.com/charts/loader.js', function () {
        // Loading charts package.
        google.charts.load('current', { 'packages': ['corechart'] });
        var statisticsObj = new Statistics();
        // Draw the pie chart for Wins and Losses when Charts is loaded.
        google.charts.setOnLoadCallback(statisticsObj.drawVictoryCountChart);
        // Draw the pie chart for the Credits bet and Credits won when Charts is loaded.
        google.charts.setOnLoadCallback(statisticsObj.drawBetChart);
    });
    var statisticsObj = new Statistics();
    var saveClick = document.getElementById("save-btn");
    //Event Listener for the Save button
    saveClick.addEventListener("click", statisticsObj.processSaveBtnClick);
};
var Statistics = /** @class */ (function () {
    function Statistics() {
    }
    // Callback that draws the pie chart for Wins and Losses.
    Statistics.prototype.drawVictoryCountChart = function () {
        //Retrieves data from the Parent Node "games" but limited to the last child node
        database.ref("games").limitToLast(1).on("child_added", function (snapshot) {
            totalLosses = snapshot.val().total_losses;
            totalWins = snapshot.val().total_wins;
            // Create the data table for Wins and Losses.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Victory Count');
            data.addColumn('number', 'Slices');
            data.addRows([
                ['Total Wins', totalWins],
                ['Total Losses', totalLosses]
            ]);
            // Set options for Wins and Losses pie chart.
            var options = {
                is3D: true,
                width: 700,
                height: 600,
                backgroundColor: {
                    fill: 'black'
                },
                legend: {
                    textStyle: { color: 'white' }
                }
            };
            // Instantiate and draw the chart for Wins and Losses.
            var chart = new google.visualization.PieChart(document.getElementById('wins-losses'));
            chart.draw(data, options);
        });
    };
    // Callback that draws the pie chart for Credits bet and Credits won.
    Statistics.prototype.drawBetChart = function () {
        //Retrieves data from the Parent Node "games" but limited to the last child node
        database.ref("games").limitToLast(1).on("child_added", function (snapshot) {
            totalCreditsBet = snapshot.val().total_credits_bet;
            totalCreditsWon = snapshot.val().total_credits_won;
            // Create the data table for Credits bet and Credits won.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Credits');
            data.addColumn('number', 'Slices');
            data.addRows([
                ['Total Credits Bet', totalCreditsBet],
                ['Total Credits Won', totalCreditsWon]
            ]);
            // Set options for Credits bet and Credits won pie chart.
            var options = {
                is3D: true,
                width: 700,
                height: 600,
                backgroundColor: {
                    fill: 'black'
                },
                legend: {
                    textStyle: { color: 'white' }
                }
            };
            // Instantiate and draw the chart for Credits bet and Credits won.
            var chart = new google.visualization.PieChart(document.getElementById('credits-bet-won'));
            chart.draw(data, options);
        });
    };
    Statistics.prototype.generateStatisticsLabels = function () {
        //Retrieves data from the Parent Node "games" but limited to the last child node
        database.ref("games").limitToLast(1).on("child_added", function (snapshot) {
            avg = snapshot.val().average;
            totalLosses = snapshot.val().total_losses;
            totalWins = snapshot.val().total_wins;
            var averageLabel = document.getElementById("avg");
            averageLabel.innerHTML = "AVERAGE : " + avg.toString();
            var lossesLabel = document.getElementById("total-losses");
            lossesLabel.innerHTML = "TOTAL LOSSES : " + totalLosses.toString();
            var winsLabel = document.getElementById("total-wins");
            winsLabel.innerHTML = "TOTAL WINS : " + totalWins.toString();
        });
    };
    Statistics.prototype.processSaveBtnClick = function () {
        //Retrieves data from the Parent Node "games" but limited to the last child node
        database.ref("games").limitToLast(1).on("child_added", function (snapshot) {
            avg = snapshot.val().average;
            totalLosses = snapshot.val().total_losses;
            totalWins = snapshot.val().total_wins;
            totalCreditsBet = snapshot.val().total_credits_bet;
            totalCreditsWon = snapshot.val().total_credits_won;
            //Uses FileSaver.js file: https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
            //Generates and writes to new .txt file
            var blobObj = new Blob(["Slot Machine Statistics for " + Date() + "\r\n===========================" +
                    "============================================================" + "\r\n\r\nTotal Wins: " + totalWins +
                    "\r\nTotal Losses: " + totalLosses + "\r\nTotal Credits Bet: " + totalCreditsBet + "\r\nTotal Credits Won: " +
                    totalCreditsWon + "\r\nNet Average: " + avg], { type: "text/plain; charset=utf-8" });
            saveAs(blobObj, Date() + ".txt"); //Downloads .txt file with game statistics
        });
    };
    return Statistics;
}());
