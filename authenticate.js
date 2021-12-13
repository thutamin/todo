// Function for Registering or Signing new user 


const register = () =>{
    const email = document.getElementById("email").value
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const lastlogin = new Date(Date.now())

    // Form Validation before creating a new account

    if(validate_email(email) == false || validate_password(password)==false){
        alert("Email or Password in incorrect format")
        return 
    }
    if(validate_field(username) == false){
        alert("Please fill in the username")
        return 
    }

    // Using firebase to create a new user with email and password
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        return db.collection('users').doc(cred.user.uid).set({
            Name: username,
            Email: email,
            Lastlogin: lastlogin.toUTCString(),
        }).then(() => {
            alert("Sign up success! You can head on to log in!")
        }).catch(err => {
            console.log(err.message);
        })
    }).catch(err => {
        console.log(err.message + "!");
    })

}


// Function for Registering or Signing new user 

const login = () =>{

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    console.log(email)
    console.log(password)


    // Form Validation before loggin in

    if(validate_email(email) == false || validate_password(password)==false){
        alert("Email or Password in incorrect format")
        return 
    }


    // persistence is set only to the current session. i.e. if the user closes the tab or browser, the user will be log out.

    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {

        // Called the signIn function. A little bit rusty with JS syntax. Ideally would be using async-await instead of callbacks or promises. 
        return signIn(email, password);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    });

}

// Function for Logging in or Signing in

function signIn(email,password){
    const lastlogin = new Date(Date.now())
    auth.signInWithEmailAndPassword(email, password)
    .then((cred) => {
        return db.collection('users').doc(cred.user.uid).update({
            Lastlogin: lastlogin.toUTCString(),
        }).then(() => {
            window.location.replace("dashboard.html");
        }).catch(err => {
            console.log(err.message);
        })
    })
    .catch(err => {
        console.log(err.message + "!");
    })
}


// function to validate email

function validate_email(email){
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if(expression.test(email)==true){
        return true
    }
    else{
        return false
    }

}


// function to check whether the password has 8 characters.

function validate_password(password){
    if (password < 8){
        return false;
    }
    else{
        return true;
    }
}


// function to check whether the input fields are blank or not.

function validate_field(field){
    if(field == null || field.length <=0){
        return false;
    }
    else{
        return true
    }
    
}