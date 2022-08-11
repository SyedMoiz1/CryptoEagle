
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



document.getElementById('signup-button').addEventListener('click',()=>{
    signup();

})

function signup(){
    let user_email_new = document.getElementById("email-input-new").value;
    let user_pass_new = document.getElementById("password-input-new").value;
    console.log(user_email_new,user_pass_new)
}