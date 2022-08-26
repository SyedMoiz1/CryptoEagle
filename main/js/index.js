
import { initializeApp } from 'firebase/app'//instead of importing all firebase methods, version 9 allows importing only methods you need
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth'
import {
    child,
    Database,
    getDatabase,
    getInstance,
    onValue,
    push,
    ref,
    remove,
    set,
    get
} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyCNjrhqFXZR5MoBWB8_kOJL503IMVbSMR8",
    authDomain: "cryptoeagle-3146b.firebaseapp.com",
    projectId: "cryptoeagle-3146b",
    storageBucket: "cryptoeagle-3146b.appspot.com",
    messagingSenderId: "633260857508",
    appId: "1:633260857508:web:7720acbed75dcec0b02e31",
    measurementId: "G-0H8T9ZL7X7"
};



//--------------------------------------------------------------------------
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000
require('dotenv').config()

const app = express()
//--------------------------------------------------------------------------
initializeApp(firebaseConfig)
const auth = getAuth();
const provider = new GoogleAuthProvider();


var watchlist = [];//array to save coins to the user's watchlist 
var watchlist_addKey = [];//array to save the key designated to each push request to the database
var watchlist_read = [];


function displayWatchlistModal() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            //user is signed in
            console.log('user (' + user.uid + ') signed in')
            document.getElementById('sign-in-nav').style.display = 'none'
            document.getElementById('image-nav-item').style.display = 'flex'

            const userInitial = user.email.charAt(0)

            if (user.photoURL == null) {
                document.getElementById('account-modal-image-container').innerHTML = '<img src="https://ui-avatars.com/api/?background=random&color=fff&name=' + userInitial + '" id="account-modal-image" alt="">'
                document.getElementById('image-nav-item').innerHTML = ('<img src="https://ui-avatars.com/api/?background=random&color=fff&name=' + userInitial + '" class="nav-link text-white" id="image-nav" ></img>')

            }
            else {
                document.getElementById('account-modal-image-container').innerHTML = '<img src="' + user.photoURL + '" id="account-modal-image" alt="">'
                document.getElementById('image-nav-item').innerHTML = ('<img src="' + user.photoURL + '" class="nav-link text-white" id="image-nav" ></img>')

            }

            document.getElementById('modal-email').innerText = user.email
            const uid = user.uid;

            document.getElementById('image-nav').addEventListener('click', () => {
                document.querySelector('.account-modal-container').style.display = 'flex'
                gsap.to('.account-modal', {
                    right: -15,
                    duration: 0.3,
                })
            })
            document.getElementById('account-modal-close').addEventListener('click', () => {
                gsap.to('.account-modal', {
                    right: -450,
                    duration: 0.3,
                })
                setTimeout(function wait() {
                    document.querySelector('.account-modal-container').style.display = 'none'

                }, 300);
            })


            user_signout();

        } else {
            console.log('user not signed in')
            // User is signed out
            document.getElementById('sign-in-nav').style.display = 'flex'
            document.getElementById('image-nav-item').style.display = 'none'
        }


        function user_signout() {
            document.getElementById('modal-signout').addEventListener('click', () => {
                signOut(auth).then(() => {
                    document.querySelector('.account-modal-container').style.display = 'none'
                }).catch((error) => {
                    alert(error.message)
                });
                location.reload();
            })
        }

    });

}

function getWatchlist(userId) {
    const db = getDatabase();
    const reference = ref(db, 'users/' + userId + '/user-watchlist')
    onValue(reference, (snapshot) => {
        watchlist = [];
        watchlist_addKey = [];
        snapshot.forEach((element) => {
            watchlist_addKey.push(element.key)
            watchlist.push(element.child('watchlist-item').val())
        })

        let watchlist_notEmpty = `
            <h5>Watchlist:</h5>
            <div class="watchlist-container">
            <ul id="watchlist-list" >
            </ul>
        `
        let watchlist_output = `
        <div class="text-muted">
        <h6 style="display:flex; margin-left: 0px;margin-bottom:0px; justify-content: end; font-size: 13px;">Prices in USD</h6>
      </div>
        `;
        let watchlist_output_empty = `
        <h5>Watchlist:</h5>
        <div class="watchlist-container" style="display: flex; justify-content: center;align-items:center;">
            <ul id="watchlist-list" >
            <div class="text-muted">
            <h6 style="display:flex; margin-left: 0px; justify-content: center; font-size: 16px;">Watchlist is Empty</h6>
        </div>
            </ul>
        </div>
            `;

        for (var i in watchlist) {
            var watchlist_coin = new XMLHttpRequest();
            watchlist_coin.open("GET", "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + watchlist[i] + "&order=market_cap_desc&per_page=100&page=1&sparkline=false", false);
            watchlist_coin.send(null);

            var coin_data = JSON.parse(watchlist_coin.responseText);
            var coin_name = coin_data[0].name
            var coin_price = coin_data[0].current_price

            watchlist_output += `
            <li>
            <h5 style="margin: 0px;">${coin_name}:</h5>
            <h6 style="margin: 0px;">$${coin_price}</h6>
            </li>           
            
            `
        }
        if (watchlist.length > 0) {
            $(".modal-watchlist").html(watchlist_notEmpty);
            $("#watchlist-list").html(watchlist_output);

        }
        else {
            $(".modal-watchlist").html(watchlist_output_empty);
            document.getElementsByClassName('watchlist-container').style.display = 'flex'
            document.getElementsByClassName('watchlist-container').style.paddingTop = '30px'
            document.getElementsByClassName('watchlist-container').style.justifyContent = 'center'

        }

    })
}

function displayWatchlist(userId) {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `users/${userId}/'user-watchlist`)).then((snapshot) => {
        snapshot.forEach((element) => {
            watchlist_read.push(element.child('watchlist-item').val())
        })

    }).catch((error) => {
        console.error(error);
    });

}


//gets current path
var path = window.location.pathname;



if (path == '/pages/user_account/') {
    //sign users up
    displayWatchlistModal();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            getWatchlist(user.uid)
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            document.getElementById('signup-signin-div').style.display = 'none'
            document.getElementById('signedin-div').style.display = 'flex'
            document.getElementById('user-email').innerHTML = 'ok'

            const uid = user.uid;

            document.getElementById('user-email').innerText = user.email


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

            createUserWithEmailAndPassword(auth, email, password)
                .then((cred) => {
                    signupForm.reset();//resets the form when user is created
                })
                .catch((err) => {
                    alert(err.message)
                })
        })
    }
    function user_signout() {
        document.getElementById('signout-text').addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                alert(error.message)
            });
        })
    }

}


if (path == '/pages/user_account_signin/') {

    displayWatchlistModal();
    onAuthStateChanged(auth, (user) => {
        if (user) {//user is signed in 
            getWatchlist(user.uid)
            document.getElementById('signup-signin-div').style.display = 'none'
            document.getElementById('signedin-div').style.display = 'flex'



            const uid = user.uid;

            document.getElementById('user-email').innerText = user.email

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
            signInWithEmailAndPassword(auth, email, password)
                .then((cred) => {

                    const user = cred.user;
                    console.log('user signed in: ', user)
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
        document.getElementById('signout-text').addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                alert(error.message)
            });
        })
    }


}

if (path == '/index.html') {
    displayWatchlistModal();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            getWatchlist(user.uid)




        }
        else {

        }
    });

}
if (path == '/pages/coins_home/') {


    displayWatchlistModal();

    //coindata();


    onAuthStateChanged(auth, (user) => {
        if (user) {
            getWatchlist(user.uid)

            const db = getDatabase();
            const userId = user.uid;
            const reference = ref(db, 'users/' + userId + '/user-watchlist')
            getWatchlist(userId);


            //Take snapshot using .on which updates anytime changes are made 
            //Get all children from refrence that have key 'watchlist-item' and place into array watchlist[]
            //anytime a change is made, the array resets and new elements are pushed into watchlist[]


           opencoins('market_cap_dec', reference, userId);




        }
        else {

            console.log('user is not signed in')
            document.querySelectorAll('#cryptocurrencies tr').forEach(selected => {
                selected.addEventListener("click", () => {
                    const selected_rank = selected.rowIndex;
                    const selected_coin = cryptocurrencies[selected_rank - 1].id
                    document.getElementById('watchlist-add-container').innerHTML = '<a href = "../pages/user_account_signin.html" class="watchlist-button-signedout" id = "addBtn-' + selected_coin + '"><i class="fa fa-plus" aria-hidden="true" style="padding-right: 5px;text-decoration:none"></i><p style="margin-bottom: 0px;"> Sign in to add to watchlist</p></a>'

                })
            })
        }


    });


    function opencoins(order, reference, userId) {
        console.log('ssss')
        document.querySelectorAll('#cryptocurrencies tr').forEach(selected => {
            selected.addEventListener("click", () => {
                var buttonadd_check= document.querySelector('.watchlist-button-add')
                var buttonremove_check= document.querySelector('.watchlist-button-remove')
                console.log('ok')


                console.log(order)

                if (order == 'market_cap_inc') {
                    const selected_rank = 26 - selected.rowIndex;
                }
                else {
                    const selected_rank = selected.rowIndex;
                }
                const selected_coin = cryptocurrencies[selected_rank - 1].id
                var watchlist_index = watchlist.indexOf(selected_coin)



                if (watchlist.includes(selected_coin)) {
                    document.getElementById('watchlist-remove-container').innerHTML = ' <div class="watchlist-button-remove" id= "removeBtn-' + selected_coin + '"><i class="fa fa-minus-circle" aria-hidden="true" style="padding-right: 5px; color: #2c2c2c;"></i> <p style="margin-bottom: 0px;"> Remove from watchlist</p></div>'
                    //coinref = ref(db, 'users/' + userId + '/user-watchlist/' + watchlist_addKey[watchlist_index])

                }
                else {
                    document.getElementById('watchlist-add-container').innerHTML = '<div class="watchlist-button-add" id = "addBtn-' + selected_coin + '"><i class="fa fa-plus" aria-hidden="true" style="padding-right: 5px;"></i><p style="margin-bottom: 0px;"> Add to watchlist</p></div>'
                }


                onValue(reference, (snapshot) => {
                    if (watchlist.includes(selected_coin)) {
                        document.getElementById('watchlist-add-container').style.display = 'none'
                        document.getElementById('watchlist-remove-container').style.display = 'flex'
                        document.getElementById('watchlist-remove-container').innerHTML = ' <div class="watchlist-button-remove" id= "removeBtn-' + selected_coin + '"><i class="fa fa-minus-circle" aria-hidden="true" style="padding-right: 5px; color: #2c2c2c;"></i> <p style="margin-bottom: 0px;"> Remove from watchlist</p></div>'
                        watchlist_index = watchlist.indexOf(selected_coin)
                        removeCoin(selected_coin, watchlist_addKey[watchlist_index], userId)
                    }
                    else {
                        document.getElementById('watchlist-add-container').style.display = 'flex'
                        document.getElementById('watchlist-remove-container').style.display = 'none'
                        document.getElementById('watchlist-add-container').innerHTML = '<div class="watchlist-button-add" id = "addBtn-' + selected_coin + '"><i class="fa fa-plus" aria-hidden="true" style="padding-right: 5px;"></i><p style="margin-bottom: 0px;"> Add to watchlist</p></div>'
                        addCoin(selected_coin)
                    }
                })
                if (watchlist.includes(selected_coin)) {
                    removeCoin(selected_coin, watchlist_addKey[watchlist_index], userId)
                }
                else {
                    addCoin(selected_coin)
                }





            })
            selected.addEventListener('mouseover', () => {
                selected.style.backgroundColor = "#282828";


            })
            selected.addEventListener('mouseout', () => {
                selected.style.backgroundColor = "#333";
            })
            function removeCoin(selected_coin, key, userId) {
                const db = getDatabase();
                
                const reference = ref(db, 'users/' + userId + '/user-watchlist')
                document.getElementById('removeBtn-' + selected_coin).addEventListener('click', (e) => {
                    e.stopPropagation();

                    document.getElementById('removeBtn-' + selected_coin).remove();
                    remove(ref(db, 'users/' + userId + '/user-watchlist/' + key))
                });
            }
            function addCoin(selected_coin) {
                document.getElementById('addBtn-' + selected_coin).addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.getElementById('addBtn-' + selected_coin).remove();
                    for (let i = 0; i < 1; i++) {
                        const watchlist_add = push(reference)
                        set(watchlist_add, {
                            'watchlist-item': selected_coin
                        })
                    }

                })
            }
        })

    }

    const optionMenu = document.querySelector(".select-menu"),
        selectBtn = optionMenu.querySelector(".select-btn"),
        options = optionMenu.querySelectorAll(".option"),
        sBtn_text = optionMenu.querySelector(".sBtn-text"),
        drop = optionMenu.querySelector(".options");
    var clicks = [document, selectBtn, options];

    selectBtn.addEventListener("click", () => {//opens the options menu
        optionMenu.classList.toggle("active");
    });

    function close(element) {
        element.addEventListener("click", () => { optionMenu.classList.toggle("active") });
    }

    var status1 = selectBtn.querySelector(".status").innerText;

    document.addEventListener("click", () => {//closes the options menu for any click
        if (optionMenu.classList.length == 2) {
            clicks.forEach((element) => {
                close(element);
            });
        }
    });
    onAuthStateChanged(auth, (user) => {
    options.forEach(option => {//sets selected option as the button text
        option.addEventListener("click", () => {
            sBtn_text.innerHTML = option.querySelector(".text_show").innerHTML;
            status1 = option.querySelector(".status").innerText;
            const db = getDatabase();

                if (user) {
                    const userId = user.uid;
                    const reference = ref(db, 'users/' + userId + '/user-watchlist')
                    
                    opencoins(status1,reference, userId );

                }
                else {
                    console.log('user is not signed in')
                    document.querySelectorAll('#cryptocurrencies tr').forEach(selected => {
                        selected.addEventListener("click", () => {
                            console.log(status1)
                            if (status1 == 'market_cap_inc') {
                                const selected_rank = 26 - selected.rowIndex;
                            }
                            else {
                                const selected_rank = selected.rowIndex;
                            }
                            const selected_coin = cryptocurrencies[selected_rank - 1].id
                            document.getElementById('watchlist-add-container').innerHTML = '<a href = "../pages/user_account_signin.html" class="watchlist-button-signedout" id = "addBtn-' + selected_coin + '"><i class="fa fa-plus" aria-hidden="true" style="padding-right: 5px;text-decoration:none"></i><p style="margin-bottom: 0px;"> Sign in to add to watchlist</p></a>'

                        })
                    })
                }
            })
        });

    });

    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "https://api.coingecko.com/api/v3/" + "coins" + "/markets?vs_currency=usd", false);
    xhReq.send(null);
    //save response data into var data 
    var data = JSON.parse(xhReq.responseText);





}

if (path == '/pages/news/') {
    displayWatchlistModal();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            getWatchlist(user.uid)




        }
        else {

        }
    });

}
if (path == '/pages/reset_password/') {
    displayWatchlistModal();
    reset_password();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            getWatchlist(user.uid)




        }
        else {

        }
    });

    function reset_password() {
        const resetPassForm = document.getElementById('resetpass-form')
        resetPassForm.addEventListener('submit', (e) => {

            e.preventDefault();
            document.getElementById('resetPass1').style.display = "none"
            document.getElementById('resetPass2').style.display = "block"
            const email = document.getElementById('email-input-reset').value;


            sendPasswordResetEmail(auth, email)
                .then(() => {
                    console.log('reset link sent!')

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage)
                });


        })
    }
}
if (path == '/pages/privacypolicy/') {
    displayWatchlistModal();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            getWatchlist(user.uid)




        }
        else {

        }
    });
}

