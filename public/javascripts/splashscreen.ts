window.onload = () => {

    //Adding CDNs in the window.onload method ensures the initialization each time the page is refreshed

    $.getScript('https://www.gstatic.com/firebasejs/4.8.0/firebase.js', function () {
        // Initializing Firebase with User credentials
        let config = {
            apiKey: "AIzaSyC-TUeihAdQzg8Bjv70et_hYFLka4EA5kk",
            authDomain: "slot-machine-web-app.firebaseapp.com",
            databaseURL: "https://slot-machine-web-app.firebaseio.com",
            projectId: "slot-machine-web-app",
            storageBucket: "slot-machine-web-app.appspot.com",
            messagingSenderId: "79493939550"
        };
        firebase.initializeApp(config);

        const emailTxt = <HTMLTextAreaElement>document.getElementById("email");
        const passTxt = <HTMLTextAreaElement>document.getElementById("pass");
        const loginBtn = <HTMLButtonElement>document.getElementById("log-in");
        const signupBtn = <HTMLButtonElement>document.getElementById("sign-up");
        let logoutBtn = <HTMLButtonElement>document.getElementById("log-out");
        let playBtn = <HTMLButtonElement>document.getElementById("play-btn");
        let loginMsg = <HTMLLabelElement>document.getElementById("login-msg");

        //Adding a login event
        loginBtn.addEventListener("click", ev => {
            const email = emailTxt.value;
            const pass = passTxt.value;
            const auth = firebase.auth();

            //Validates if the password field is empty
            if (pass != "") {
                //Returns a promise which is executed ONCE when the user logs in
                const loginPromise = auth.signInWithEmailAndPassword(email, pass);
                //If the promise was found with invalid credentials the error is caught
                loginPromise.catch(e => {
                    loginMsg.style.color = "red";
                    loginMsg.innerHTML = "Invalid Login Credentials! Please try again.";
                });
            }
            else {
                loginMsg.style.color = "red";
                //Error message if password field is empty
                loginMsg.innerHTML = "Fields cannot be left empty! Please try again.";
            }
        });

        //Adding a signup event
        signupBtn.addEventListener("click", ev => {
            const email = emailTxt.value;
            const pass = passTxt.value;
            const auth = firebase.auth();

            //Validates if the password field is empty
            if (pass != "") {
                //Returns a promise which is executed ONCE when the user signs up
                const signupPromise = auth.createUserWithEmailAndPassword(email, pass);
                //If the promise was found with invalid credentials the error is caught
                signupPromise.catch(e => {
                    loginMsg.style.color = "red";
                    loginMsg.innerHTML = "Invalid Sign-Up Credentials! Please try again.";
                });
            }
            else {
                loginMsg.style.color = "red";
                //Error message if password field is empty
                loginMsg.innerHTML = "Fields cannot be left empty! Please try again.";
            }
        });

        //Adding a logout event
        logoutBtn.addEventListener("click", ev => {
           firebase.auth().signOut(); //Logs user out of account
        });

        let loadCount: number = 0;
        //Adding a realtime listener for auth events
        firebase.auth().onAuthStateChanged(user => {
            //If the user is logged in
            if (user) {
                logoutBtn.style.display = "inline";
                playBtn.style.display = "inline";
                loginMsg.style.color = "green";
                //Notification if user has been logged in successfully
                loginMsg.innerHTML = "You have been signed in!";
                loadCount++;
            }
            else {
                logoutBtn.style.display = "none";
                playBtn.style.display = "none";
                //If the page has been freshly loaded
                if(loadCount == 0) {
                    loginMsg.style.color = "white";
                    loginMsg.innerHTML = "Log In or Create an Account to Play.";
                }
                else {
                    loginMsg.style.color = "green";
                    //Notification if user has been logged out
                    loginMsg.innerHTML = "You have been signed out!";
                }
            }
        });
    });
};