var totalCreditsBet = 0;
var totalCreditsWon = 0;
var avg = 0;
var totalWins = 0;
var totalLosses = 0;
var isBetMaxClicked = false;
var isReel1Spinning = false;
var isReel2Spinning = false;
var isReel3Spinning = false;
var isReel1Clicked = false;
var isReel2Clicked = false;
var isReel3Clicked = false;
var noOfGames = 0;
var amountWon;
var interval1;
var interval2;
var interval3;
var reelArray1;
var reelArray2;
var reelArray3;
var clickedSymbol1;
var clickedSymbol2;
var clickedSymbol3;
var BET_AREA_DEFAULT = "0";
var BET_MAX_AMOUNT = 3;
var BET_ONE_AMOUNT = 1;
window.onload = function () {
    var gameLogic = new GameLogic(); //Declare new GameLogic object to access instance methods
    var payoutBtnClick = document.getElementById("payout-btn");
    //Click Event Listener for the Payout Button Click
    payoutBtnClick.addEventListener("click", gameLogic.processPayoutClick);
    var addCoinClick = document.getElementById("add-coin");
    //Click Event Listener for the Add Coin Button
    addCoinClick.addEventListener("click", gameLogic.addCoin);
    var betOneClick = document.getElementById("bet-one");
    //Click Event Listener for the Bet One Button
    betOneClick.addEventListener("click", gameLogic.betOne);
    var betMaxClick = document.getElementById("bet-max");
    //Click Event Listener for the Bet Max Button
    betMaxClick.addEventListener("click", gameLogic.betMax);
    var resetClick = document.getElementById("reset");
    //Click Event Listener for the Reset Button
    resetClick.addEventListener("click", gameLogic.reset);
    var spinClick = document.getElementById("spin-btn");
    //Click Event Listener for the Spin Button
    spinClick.addEventListener("click", gameLogic.spinReels);
    var reel1Click = document.getElementById("reel1");
    //Click Event Listener for the 1st Reel
    reel1Click.addEventListener("click", gameLogic.processReel1Click);
    var reel2Click = document.getElementById("reel2");
    //Click Event Listener for the 2nd Reel
    reel2Click.addEventListener("click", gameLogic.processReel2Click);
    var reel3Click = document.getElementById("reel3");
    //Click Event Listener for the 3rd Reel
    reel3Click.addEventListener("click", gameLogic.processReel3Click);
    var logoutClick = document.getElementById("game-logout-btn");
    //Adding CDNs in the window.onload method ensures the initialization each time the page is refreshed
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
        //Deletes the Parent Node "games" each time the page is refreshed
        database.ref('games/').remove();
        //Realtime Listener which checks for user login activity
        firebase.auth().onAuthStateChanged(function (currUser) {
            if (currUser) {
                //Splits logged in user's email to get the name
                var userName = currUser.email.substring(0, currUser.email.lastIndexOf("@"));
                if (userName != null) {
                    var gameHeader = document.getElementById("game-header");
                    gameHeader.innerHTML = "Hi, " + userName + "! Welcome to the Play Framework Slot Machine";
                }
                //Click Event Listener for the Logout Button
                logoutClick.addEventListener("click", function (ev) {
                    firebase.auth().signOut();
                });
            }
            else {
                window.location.href = "/"; //Prevents users from typing the URL entry point to access the game
                // without logging into an account
            }
        });
    });
};
var Symbol = /** @class */ (function () {
    //Initializes each Symbol object with given fields
    function Symbol(imagePath, imageValue) {
        this.imagePath = imagePath;
        this.imageValue = imageValue;
    }
    //Checks if a given symbol value is equivalent to a compared symbol
    Symbol.prototype.isSymbolEqual = function (symbol) {
        var isEquals = (this.imageValue == symbol.imageValue);
        return isEquals;
    };
    return Symbol;
}());
var Reel = /** @class */ (function () {
    //Each time a Reel object is created the array is shuffled
    function Reel() {
        //Declare Symbol objects for each image
        this.cherry = new Symbol("assets/images/cherry.png", 2);
        this.lemon = new Symbol("assets/images/lemon.png", 3);
        this.plum = new Symbol("assets/images/plum.png", 4);
        this.watermelon = new Symbol("assets/images/watermelon.png", 5);
        this.bell = new Symbol("assets/images/bell.png", 6);
        this.redseven = new Symbol("assets/images/redseven.png", 7);
        //Declare and Initialize new array to hold Symbols
        this.imgArray = [this.cherry, this.lemon, this.plum, this.watermelon, this.bell, this.redseven];
        this.spin(this.imgArray);
    }
    //Spin method which randomizes array indexes of the given array
    Reel.prototype.spin = function (symbolArr) {
        var i = symbolArr.length;
        while (i > 0) {
            // Assigning a random index number
            var randomIndex = Math.floor(Math.random() * i);
            //Decrement count by 1
            i--;
            // Swapping the last index element with the element at the random index
            var temp = symbolArr[i];
            symbolArr[i] = symbolArr[randomIndex];
            symbolArr[randomIndex] = temp;
        }
        return symbolArr;
    };
    return Reel;
}());
var GameLogic = /** @class */ (function () {
    function GameLogic() {
    }
    //Processes Payout button click event
    GameLogic.prototype.processPayoutClick = function () {
        //Uses FileSaver.js file: https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
        //Generates and writes to new .txt file
        var blobObj = new Blob([
            "Payout Information\r\n" +
                "==================\r\n\r\n" +
                "Reel Symbols\r\n" +
                "------------\r\n" +
                "Cherry        | Value: 2\r\n" +
                "Lemon         | Value: 3\r\n" +
                "Plum          | Value: 4\r\n" +
                "Watermelon    | Value: 5\r\n" +
                "Bell          | Value: 6\r\n" +
                "Seven         | Value: 7\r\n\r\n" +
                "Important Facts to know\r\n" +
                "-----------------------\r\n" +
                "• There are 3 reels in the Slot Machine\r\n" +
                "• Each reel has 6 different symbols with values each ranging from 2 to 7 (shown above)\r\n" +
                "• A game is won if any 2 OR MORE REEL COMBINATIONS are equal\r\n\r\n" +
                "If the nomination is £1,\r\n" +
                "Probability of Winning Combinations\r\n" +
                "-----------------------------------\r\n" +
                "Probability of a symbol occurring in 2 REELS -> 1/6 * 1/6 = 0.02778889\r\n" +
                "Probability of a symbol occurring in all 3 REELS -> 1/6 * 1/6 * 1/6 = 0.00463241\r\n\r\n" +
                "• Note that the probability of a symbol occurring in a single reel is 1/6 because there are 6 symbols in 1 reel.\r\n" +
                "• Also, note that we have multiplied probabilities 2 times in the first instance because only 2 reels were equal and 3 times in the second instance because all 3 reels were equal.\r\n\r\n" +
                "Payout of Winning Combinations\r\n" +
                "------------------------------\r\n" +
                "2 x Cherry        | Payout -> 2 * 0.02778889 = 0.05557778\r\n" +
                "2 x Lemon         | Payout -> 3 * 0.02778889 = 0.08336667\r\n" +
                "2 x Plum          | Payout -> 4 * 0.02778889 = 0.11115556\r\n" +
                "2 x Watermelon    | Payout -> 5 * 0.02778889 = 0.13894445\r\n" +
                "2 x Bell          | Payout -> 6 * 0.02778889 = 0.16673334\r\n" +
                "2 x Seven         | Payout -> 7 * 0.02778889 = 0.19452223\r\n" +
                "Total Payout for a symbol occurring in 2 REELS -> 0.05557778 + 0.08336667 + 0.11115556 + 0.13894445 + 0.16673334 + 0.19452223 = 0.75030003\r\n" +
                "------------------------------------------------------------------------------------------------------------------------------------------\r\n" +
                "3 x Cherry        | Payout -> 2 * 0.00463241 = 0.00926482\r\n" +
                "3 x Lemon         | Payout -> 3 * 0.00463241 = 0.01389723\r\n" +
                "3 x Plum          | Payout -> 4 * 0.00463241 = 0.01852964\r\n" +
                "3 x Watermelon    | Payout -> 5 * 0.00463241 = 0.02316205\r\n" +
                "3 x Bell          | Payout -> 6 * 0.00463241 = 0.02779446\r\n" +
                "3 x Seven         | Payout -> 7 * 0.00463241 = 0.03242687\r\n" +
                "Total Payout for a symbol occurring in ALL 3 REELS -> 0.00926482 + 0.01389723 + 0.01852964 + 0.02316205 + 0.02779446 + 0.03242687 = 0.12507527\r\n" +
                "----------------------------------------------------------------------------------------------------------------------------------------------\r\n\r\n" +
                "Total Payout for ALL winning combinations -> 0.75030003 + 0.12507527 = 0.8753753\r\n\r\n" +
                //Algorithm to compute Payout Percentage
                "Since the payout for £1 nomination is 0.8753753 (each time we bet £1, we win £0.8753753 on average),\r\n\r\n" +
                "Payout Percentage -> 0.8753753 * 100% = 87.53753% ≈ 90%.\r\n\r\n" +
                "Therefore, I have completed the Computation of approximately 90% payout on a £1 nomination.\r\n" +
                "-------------------------------------------------------------------------------------------\r\n" +
                "Thank You!"
        ], { type: "text/plain; charset=utf-8" });
        saveAs(blobObj, "Payout_Analysis_Web.txt"); //Downloads .txt file with payout details
    };
    //Processes add coin click event
    GameLogic.prototype.addCoin = function () {
        var creditAreaString = document.getElementById("credit-area");
        var creditAreaInt = parseInt(creditAreaString.innerText) + 1; //Updating credit area with +1 coins
        document.getElementById("credit-area").innerHTML = creditAreaInt.toString();
    };
    //Processes bet one click event
    GameLogic.prototype.betOne = function () {
        var creditAreaString = document.getElementById("credit-area");
        var betAreaString = document.getElementById("bet-area");
        //Validates if the credit area has at least one credit
        if (parseInt(creditAreaString.innerText) >= BET_ONE_AMOUNT) {
            var creditAreaInt = parseInt(creditAreaString.innerText) - BET_ONE_AMOUNT; //Decrements credit area a credit
            var betAreaInt = parseInt(betAreaString.innerText) + BET_ONE_AMOUNT; //Increments bet area a credit
            document.getElementById("credit-area").innerHTML = creditAreaInt.toString();
            document.getElementById("bet-area").innerHTML = betAreaInt.toString();
        }
        else {
            //Error message if credit area has insufficient credits
            alert("Insufficient credits! Please add coins to continue betting.");
        }
    };
    //Processes bet max click event
    GameLogic.prototype.betMax = function () {
        var creditAreaString = document.getElementById("credit-area");
        var betAreaString = document.getElementById("bet-area");
        //Validates if bet max has been clicked once before
        if (isBetMaxClicked == false) {
            //Validates if the credit area has at least three credit
            if (parseInt(creditAreaString.innerText) >= BET_MAX_AMOUNT) {
                var creditAreaInt = parseInt(creditAreaString.innerText) - BET_MAX_AMOUNT; //Decrements credit area 3 credits
                var betAreaInt = parseInt(betAreaString.innerText) + BET_MAX_AMOUNT; //Increments bet area 3 credits
                document.getElementById("credit-area").innerHTML = creditAreaInt.toString();
                document.getElementById("bet-area").innerHTML = betAreaInt.toString();
                isBetMaxClicked = true;
            }
            else {
                //Error message if credit area has insufficient credits
                alert("Insufficient credits! Please add coins to continue betting.");
            }
        }
        else {
            //Error message if bet max button has already been clicked
            alert("You have already clicked Bet Max!");
        }
    };
    //Processes reset click event
    GameLogic.prototype.reset = function () {
        var creditAreaString = document.getElementById("credit-area");
        var betAreaString = document.getElementById("bet-area");
        var betAreaInt = parseInt(betAreaString.innerText);
        //Validates if bet area has more than 0 credits
        if (betAreaInt > 0) {
            var creditAreaInt = parseInt(creditAreaString.innerText) + betAreaInt;
            document.getElementById("bet-area").innerHTML = BET_AREA_DEFAULT; //Returns bet area to default value
            document.getElementById("credit-area").innerHTML = creditAreaInt.toString();
        }
        else {
            //Error message is bet area is empty
            alert("Bet area empty! Please bet some credits.");
        }
    };
    //Processes spin click event
    GameLogic.prototype.spinReels = function () {
        var betAreaString = document.getElementById("bet-area");
        //Validates if bet area is not empty
        if (parseInt(betAreaString.innerText) > 0) {
            //Validates that the reel spinning boolean flags are set to false
            if (!isReel1Spinning && !isReel2Spinning && !isReel3Spinning) {
                noOfGames++; //Increments game counter
                var addCoinClick = document.getElementById("add-coin");
                var betOneClick = document.getElementById("bet-one");
                var betMaxClick = document.getElementById("bet-max");
                var resetClick = document.getElementById("reset");
                var statisticsClick = document.getElementById("statistics-btn");
                //Disables game buttons when reels are spinning
                addCoinClick.disabled = true;
                betOneClick.disabled = true;
                betMaxClick.disabled = true;
                resetClick.disabled = true;
                statisticsClick.disabled = true;
                //Sets 3 reels as unclicked when reels are spinning
                isReel1Clicked = false;
                isReel2Clicked = false;
                isReel3Clicked = false;
                //Sets 3 reels as spinning when reels are spinning
                isReel1Spinning = true;
                isReel2Spinning = true;
                isReel3Spinning = true;
                //Declare 3 reel objects for the 3 reels
                reelArray1 = new Reel();
                reelArray2 = new Reel();
                reelArray3 = new Reel();
                var reel1Image_1 = document.getElementById("reel1");
                var reel2Image_1 = document.getElementById("reel2");
                var reel3Image_1 = document.getElementById("reel3");
                var i_1 = 0;
                //Declare new setInterval anonymous function to spin the 1st reel with a 90ms interval between image switches
                interval1 = setInterval(function () {
                    //Assigns the URL of the image in the current array index to the reel
                    reel1Image_1.src = reelArray1.imgArray[i_1].imagePath;
                    i_1++;
                    //If the index of the array reaches 6, it is reinitialized to 0, to simulate the loop
                    if (i_1 == 6) {
                        i_1 = 0;
                    }
                }, 90);
                var j_1 = 0;
                //Declare new setInterval anonymous function to spin the 2nd reel with a 90ms interval between image switches
                interval2 = setInterval(function () {
                    //Assigns the URL of the image in the current array index to the reel
                    reel2Image_1.src = reelArray2.imgArray[j_1].imagePath;
                    j_1++;
                    //If the index of the array reaches 6, it is reinitialized to 0, to simulate the loop
                    if (j_1 == 6) {
                        j_1 = 0;
                    }
                }, 90);
                var k_1 = 0;
                //Declare new setInterval anonymous function to spin the 3rd reel with a 90ms interval between image switches
                interval3 = setInterval(function () {
                    //Assigns the URL of the image in the current array index to the reel
                    reel3Image_1.src = reelArray3.imgArray[k_1].imagePath;
                    k_1++;
                    //If the index of the array reaches 6, it is reinitialized to 0, to simulate the loop
                    if (k_1 == 6) {
                        k_1 = 0;
                    }
                }, 90);
            }
            else {
                alert("Reels are already spinning!"); //Error message if spin button is clicked more than once
            }
        }
        else {
            //Error message if bet area is empty
            alert("Bet haven't been placed! Please bet to continue.");
        }
    };
    //Processes 1st reel click event
    GameLogic.prototype.processReel1Click = function () {
        //Validates if 1st reel hasn't been already clicked and it's spinning
        if (!isReel1Clicked && isReel1Spinning) {
            clearInterval(interval1); //Clears setInterval functionality, thereby stopping the spinning reels
            isReel1Spinning = false;
            isReel1Clicked = true;
        }
        else {
            alert("You can only stop a reel when it's spinning!"); //Error message if reel is clicked when it's not spinning
        }
        //Validates if all 3 reels have been clicked and are not spinning
        if (isReel1Clicked && isReel2Clicked && isReel3Clicked && !isReel1Spinning && !isReel2Spinning && !isReel3Spinning) {
            GameLogic.processAllReelsClicked();
        }
    };
    //Processes 2nd reel click event
    GameLogic.prototype.processReel2Click = function () {
        //Validates if 2nd reel hasn't been already clicked and it's spinning
        if (!isReel2Clicked && isReel2Spinning) {
            clearInterval(interval2); //Clears setInterval functionality, thereby stopping the spinning reels
            isReel2Spinning = false;
            isReel2Clicked = true;
        }
        else {
            alert("You can only stop a reel when it's spinning!"); //Error message if reel is clicked when it's not spinning
        }
        //Validates if all 3 reels have been clicked and are not spinning
        if (isReel1Clicked && isReel2Clicked && isReel3Clicked && !isReel1Spinning && !isReel2Spinning && !isReel3Spinning) {
            GameLogic.processAllReelsClicked();
        }
    };
    //Processes 3rd reel click event
    GameLogic.prototype.processReel3Click = function () {
        //Validates if 3rd reel hasn't been already clicked and it's spinning
        if (!isReel3Clicked && isReel3Spinning) {
            clearInterval(interval3); //Clears setInterval functionality, thereby stopping the spinning reels
            isReel3Spinning = false;
            isReel3Clicked = true;
        }
        else {
            alert("You can only stop a reel when it's spinning!"); //Error message if reel is clicked when it's not spinning
        }
        //Validates if all 3 reels have been clicked and are not spinning
        if (isReel1Clicked && isReel2Clicked && isReel3Clicked && !isReel1Spinning && !isReel2Spinning && !isReel3Spinning) {
            GameLogic.processAllReelsClicked();
        }
    };
    //Method to process post-spin functionalities
    GameLogic.processAllReelsClicked = function () {
        var addCoinClick = document.getElementById("add-coin");
        var betOneClick = document.getElementById("bet-one");
        var betMaxClick = document.getElementById("bet-max");
        var resetClick = document.getElementById("reset");
        var statisticsClick = document.getElementById("statistics-btn");
        //Re-enables all game buttons after spinning has stopped
        addCoinClick.disabled = false;
        betOneClick.disabled = false;
        betMaxClick.disabled = false;
        resetClick.disabled = false;
        statisticsClick.disabled = false;
        isBetMaxClicked = false;
        var reel1 = document.getElementById("reel1");
        var reel2 = document.getElementById("reel2");
        var reel3 = document.getElementById("reel3");
        //Getting the substring of the 3 image's path excluding the localhost domain name
        var reel1Path = reel1.src.substring(22);
        var reel2Path = reel2.src.substring(22);
        var reel3Path = reel3.src.substring(22);
        //Checks all 3 arrays in the Reel objects for the current reel's image URL which exists in a Symbol
        for (var i = 0; i < reelArray1.imgArray.length; i++) {
            if (reel1Path == reelArray1.imgArray[i].imagePath) {
                clickedSymbol1 = reelArray1.imgArray[i];
            }
            if (reel2Path == reelArray2.imgArray[i].imagePath) {
                clickedSymbol2 = reelArray2.imgArray[i];
            }
            if (reel3Path == reelArray3.imgArray[i].imagePath) {
                clickedSymbol3 = reelArray3.imgArray[i];
            }
        }
        GameLogic.checkVictory(clickedSymbol1, clickedSymbol2, clickedSymbol3);
    };
    //Calculates statistics
    GameLogic.checkVictory = function (symbol1, symbol2, symbol3) {
        var isReelOneEqualsTwo;
        isReelOneEqualsTwo = symbol1.isSymbolEqual(symbol2); //Checks if 1st reel is equal to the 2nd reel
        var isReelTwoEqualsThree;
        isReelTwoEqualsThree = symbol2.isSymbolEqual(symbol3); //Checks if 2nd reel is equal to the 3rd reel
        var isReelOneEqualsThree;
        isReelOneEqualsThree = symbol1.isSymbolEqual(symbol3); //Checks if 1st reel is equal to the 3rd reel
        var creditAreaString = document.getElementById("credit-area");
        var betAreaString = document.getElementById("bet-area");
        var creditAreaInt = parseInt(creditAreaString.innerText);
        var betAreaInt = parseInt(betAreaString.innerText);
        if (isReelOneEqualsTwo) {
            amountWon = symbol2.imageValue * betAreaInt; //Calculates credits won
            creditAreaInt += amountWon; //Credit area is updated with current amount + won amount
            creditAreaString.innerHTML = creditAreaInt.toString();
            totalCreditsBet += betAreaInt;
            betAreaString.innerHTML = BET_AREA_DEFAULT; //Bet area is reinitialized to default value
            totalCreditsWon += amountWon;
            avg = (totalCreditsWon - totalCreditsBet) / noOfGames; //Net Average is taken by subtracting the total credits
            // won from the total credits bet and dividing by number of games played
            totalWins++;
            alert("CONGRATULATIONS! YOU WON" + "\nCREDITS WON: " + amountWon); // Alert is called to announce victory
        }
        else if (isReelTwoEqualsThree) {
            amountWon = symbol2.imageValue * betAreaInt; //Calculates credits won
            creditAreaInt += amountWon; //Credit area is updated with current amount + won amount
            creditAreaString.innerHTML = creditAreaInt.toString();
            totalCreditsBet += betAreaInt;
            betAreaString.innerHTML = BET_AREA_DEFAULT; //Bet area is reinitialized to default value
            totalCreditsWon += amountWon;
            avg = (totalCreditsWon - totalCreditsBet) / noOfGames; //Net Average is taken by subtracting the total credits
            // won from the total credits bet and dividing by number of games played
            totalWins++;
            alert("CONGRATULATIONS! YOU WON" + "\nCREDITS WON: " + amountWon); // Alert is called to announce victory
        }
        else if (isReelOneEqualsThree) {
            amountWon = symbol1.imageValue * betAreaInt; //Calculates credits won
            creditAreaInt += amountWon; //Credit area is updated with current amount + won amount
            creditAreaString.innerHTML = creditAreaInt.toString();
            totalCreditsBet += betAreaInt;
            betAreaString.innerHTML = BET_AREA_DEFAULT; //Bet area is reinitialized to default value
            totalCreditsWon += amountWon;
            avg = (totalCreditsWon - totalCreditsBet) / noOfGames; //Net Average is taken by subtracting the total credits
            // won from the total credits bet and dividing by number of games played
            totalWins++;
            alert("CONGRATULATIONS! YOU WON" + "\nCREDITS WON: " + amountWon); // Alert is called to announce victory
        }
        else {
            amountWon = 0;
            totalCreditsBet += betAreaInt;
            betAreaString.innerHTML = BET_AREA_DEFAULT.toString();
            avg = (totalCreditsWon - totalCreditsBet) / noOfGames; //Net Average is taken by subtracting the total credits
            totalLosses++;
            alert("SORRY! YOU LOST"); // Alert is called to announce loss
        }
        GameLogic.writeToFirebaseDb();
    };
    GameLogic.writeToFirebaseDb = function () {
        //Writing statistics to Firebase Realtime Database as a JSON Object
        //Parent Node will be "games" under which the game counter will act as a child node under which each game's statistics will be stored
        database.ref("games/" + noOfGames).set({
            "total_credits_bet": totalCreditsBet,
            "total_credits_won": totalCreditsWon,
            "total_wins": totalWins,
            "total_losses": totalLosses,
            "average": avg,
            "user_id": firebase.auth().currentUser.uid,
            "user_email": firebase.auth().currentUser.email // Currently logged in user's email
        });
    };
    return GameLogic;
}());
