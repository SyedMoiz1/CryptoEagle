import { initializeApp } from 'firebase/app'//instead of importing all firebase methods, version 9 allows importing only methods you need
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCNjrhqFXZR5MoBWB8_kOJL503IMVbSMR8",
    authDomain: "cryptoeagle-3146b.firebaseapp.com",
    projectId: "cryptoeagle-3146b",
    storageBucket: "cryptoeagle-3146b.appspot.com",
    messagingSenderId: "633260857508",
    appId: "1:633260857508:web:7720acbed75dcec0b02e31",
    measurementId: "G-0H8T9ZL7X7"
};


initializeApp(firebaseConfig)
const auth = getAuth();
const provider = new GoogleAuthProvider();

//gets current path
var path = window.location.pathname;



if (path == '/pages/user_account.html') {
    //sign users up

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            document.getElementById('signup-signin-div').style.display = 'none'
            document.getElementById('signedin-div').style.display = 'flex'
            const uid = user.uid;
            console.log('current user id : ' + uid)
            console.log('current user email: ' + user.email)


            user_signout();




        }
        else {
            //no user signed in
            document.getElementById('signup-signin-div').style.display = 'flex'
            document.getElementById('signedin-div').style.display = 'none'

            console.log('no user signed in')

            user_signup();


        }
    });

    function user_signup() {
        const signupForm = document.getElementById('signup-form')
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();//prevents default refresh of form
            const email = document.getElementById('email-input-new').value;
            const password = document.getElementById('password-input-new').value;

            console.log(email, password)
            createUserWithEmailAndPassword(auth, email, password)
                .then((cred) => {
                    console.log('user created:', cred.user)
                    signupForm.reset();//resets the form when user is created
                })
                .catch((err) => {
                    alert(err.message)
                })
        })
    }
    function user_signout() {
        document.getElementById('signout-button').addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                alert(error.message)
            });
        })
    }

}


if (path == '/pages/user_account_signin.html') {
    onAuthStateChanged(auth, (user) => {
        if (user) {//user is signed in 
            document.getElementById('signup-signin-div').style.display = 'none'
            document.getElementById('signedin-div').style.display = 'flex'

            const uid = user.uid;
            console.log('current user id : ' + uid)
            console.log('current user email: ' + user.email)

            user_signout();

        } else {
            document.getElementById('signup-signin-div').style.display = 'flex'
            document.getElementById('signedin-div').style.display = 'none'
            console.log('no user signed in')

            user_signin();

        }
    });

    function user_signin() {
        const signinForm = document.getElementById('signin-form')
        const googlebtn = document.getElementById('google-button')


        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input-login').value;
            const password = document.getElementById('password-input-login').value;
            console.log(email, password)
            signInWithEmailAndPassword(auth, email, password)
                .then((cred) => {

                    const user = cred.user;
                    console.log('user signed in:', user)
                    signinForm.reset();

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage)
                });
        })

        googlebtn.addEventListener('click', () => {
            console.log('google sign-in')
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
        })

    }
    function user_signout() {
        document.getElementById('signout-button').addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                alert(error.message)
            });
        })
    }


}