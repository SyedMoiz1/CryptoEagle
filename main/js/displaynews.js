$(document).ready(function () {

    setTimeout(function wait() {
        displaynews('cryptocurrency')
    }, 2880);


    const searchBtn = document.querySelector('#news-search')
    const searchInput = document.querySelector('#search-input');
    if (searchInput != '') {
        searchBtn.addEventListener('click', () => {

            const inputValue = searchInput.value;
            displaynews(inputValue)
        })
        document.addEventListener('keypress', (event) => {

            // event.keyCode or event.which  property will have the code of the pressed key
            let keyCode = event.keyCode ? event.keyCode : event.which;

            // 13 points the enter key
            if (keyCode === 13) {
                // call click function of the buttonn 
                searchBtn.click();
            }

        });


    }


    function search_func(e) {
        e = e || window.event;
        if (e.keyCode == 13) {
            const inputValue = searchInput.value;
            displaynews(inputValue);

            return false;
        }
        return true;
    }

    function displaynews(keyword) {
        let url = "https://newsapi.org/v2/everything?q=" + keyword + "&from=2022-07-26&sortBy=popularity&apiKey=1cc8451c95584bf686f4f719b9820688";

        $.ajax({
            url: url,
            method: "GET",
            dataType: "JSON",

            beforeSend: function () {
                document.querySelector('#news-loader').style.display = 'flex'
            },

            complete: function () {
                document.querySelector('#news-loader').style.display = 'none'
            },

            success: function (newsdata) { //succefully fetches data
                let output = "";
                let news = newsdata.articles;//saves array of all articles in variable news
                if (news.length == 0) {
                    console.log('empty')
                    $("#newsResults").html(
                        '<h4 style="color: white; padding-top: 20px; margin-bottom:200px ;">There are no articles, try searching for something else </h4> '
                    );
                }

                for (var i in news) {

                    //save entire data in a grid of divs
                    output += `
                        <div class="col-lg-4 col-sm-12 col-md-6">
                        <div class="card" style="margin-top: 13px;" id="news-card">

                            <div class="card-image">
                            <img src="${news[i].urlToImage}" class="card-img-top" alt="${news[i].title}">
                            </div>

                            <div class="card-body">
                            <p class="fw-italic" style="font-size: 12px;font-weight:200; color:#8e9db5; text-transform: uppercase;" >${news[i].source.name}</p>
                            <h5 class="card-title">Title: <a href="${news[i].url}" title="${news[i].title}" style="text-decoration: none;">${news[i].title}</a></h5>
                            <p > <span class="fw-bold">Published: </span> ${news[i].publishedAt}</p>
                            <div >
                            <p id="card-desc" > <span class="fw-bold" style="font-weight:500; ">Description: </span>${news[i].description} </p>
                            </div>
                            <a href="${news[i].url}" class="btn btn-primary" id="news-read" style="background-color: #F7CA14; color:#2C2C2C; font-weight:700; border: 2px solid rgba(253, 253, 253, 0.1); margin-top: 10px;">Read More</a>
                            </div>

                        </div>
                        </div>
                    `;


                }

                if (output !== "") {
                    $("#newsResults").html(output);
                    console.log(output)
                }

            },
            error: function () {//if any error occurs while fetching data
                let errorMsg = `<div class="errorMsg center">Some error occured</div>`;
                $("#newsResults").html(errorMsg);
            }
        })

    }


})

