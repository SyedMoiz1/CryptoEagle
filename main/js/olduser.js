firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      // ...
    } else {
        console.log('user not signed in')
    }
  });

document.getElementById('signin-button').addEventListener('click',()=>{
    login();

})


function login(){
    let user_email_old = document.getElementById("email-input-login").value;
    let user_pass_old = document.getElementById("password-input-login").value;
    console.log(user_email_old, user_pass_old)

}


