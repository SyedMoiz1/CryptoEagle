

//-----------------------------------------------------------
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

document.addEventListener("click", () => {//closes the options menu for any click
  if (optionMenu.classList.length == 2) {
    clicks.forEach(element => {
      close(element);
    });
  }
});

var status = selectBtn.querySelector(".status").innerText;


options.forEach(option => {//sets selected option as the button text
  option.addEventListener("click", () => {
    sBtn_text.innerHTML = option.querySelector(".text_show").innerHTML;
    status = option.querySelector(".status").innerText;
    resetBoard(status);

  });

});
//------------------------------------------------------------------------

//fetch crypto data and put it in variable called data
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "https://api.coingecko.com/api/v3/" + "coins" + "/markets?vs_currency=usd", false);
xhReq.send(null);
//save response data into var data 
var data = JSON.parse(xhReq.responseText);//data recieved is a JSON string, parse and turn into Javascript object

//initialize array
var cryptocurrencies;


//pushing objects from data[] into cryptocurrencies[]
function resetBoard(order) {
  var $list = $("#cryptocurrencies");//initializing list
  $list.find(".cryptocurrency").remove();//.remove() allows the list items to be removed and reset for whn it updates
  cryptocurrencies = [];
  const numOfCoins = 25;
  if (order == "market_cap_dec") {
    for (let i = 0; i < numOfCoins; i++) {//for loop to attain objects one-by-one and push into array
      cryptocurrencies.push(
        {
          id: data[i].id,
          name: data[i].name,
          symbol: data[i].symbol,
          price: data[i].current_price,
          market_cap: data[i].market_cap,
          volume_24h: data[i].total_volume,
          percentage_change_24h: data[i].market_cap_change_percentage_24h,
          image: data[i].image,
        }
      )
    }
  }
  else if (order == "market_cap_inc") {
    for (let i = 0; i < numOfCoins; i++) {//for loop to attain objects one-by-one and push into array
      cryptocurrencies.push(
        {
          id: data[i].id,
          name: data[numOfCoins - (i + 1)].name,
          symbol: data[numOfCoins - (i + 1)].symbol,
          price: data[numOfCoins - (i + 1)].current_price,
          market_cap: data[numOfCoins - (i + 1)].market_cap,
          volume_24h: data[numOfCoins - (i + 1)].total_volume,
          percentage_change_24h: data[numOfCoins - (i + 1)].market_cap_change_percentage_24h,
          image: data[i].image,
        }
      )
    }
  }


  else if (order == "24h_dec") {
    for (let i = 0; i < numOfCoins; i++) {//for loop to attain objects one-by-one and push into array
      cryptocurrencies.push(
        {
          id: data[i].id,
          name: data[i].name,
          symbol: data[i].symbol,
          price: data[i].current_price,
          market_cap: data[i].market_cap,
          volume_24h: data[i].total_volume,
          percentage_change_24h: data[i].market_cap_change_percentage_24h,
          image: data[i].image,
        }
      )
    }//for loop ends, selection sort with decreasing 24h change

    for (let i = 0; i < cryptocurrencies.length - 1; i++) {
      for (let j = i + 1; j < cryptocurrencies.length; j++) {
        if (cryptocurrencies[j].percentage_change_24h > cryptocurrencies[i].percentage_change_24h) {
          let temp = cryptocurrencies[i];
          cryptocurrencies[i] = cryptocurrencies[j];
          cryptocurrencies[j] = temp;
        }
      }
    }
  }

  else if (order == "24h_inc") {
    for (let i = 0; i < numOfCoins; i++) {//for loop to attain objects one-by-one and push into array
      cryptocurrencies.push(
        {
          id: data[i].id,
          name: data[i].name,
          symbol: data[i].symbol,
          price: data[i].current_price,
          market_cap: data[i].market_cap,
          volume_24h: data[i].total_volume,
          percentage_change_24h: data[i].market_cap_change_percentage_24h,
          image: data[i].image,

        }
      )
    }//for loop ends, selection sort with increasing 24h change

    for (let i = 0; i < cryptocurrencies.length - 1; i++) {
      for (let j = i + 1; j < cryptocurrencies.length; j++) {
        if (cryptocurrencies[j].percentage_change_24h < cryptocurrencies[i].percentage_change_24h) {
          let temp = cryptocurrencies[i];
          cryptocurrencies[i] = cryptocurrencies[j];
          cryptocurrencies[j] = temp;
        }
      }
    }
  }



  for (var i = 0; i < cryptocurrencies.length; i++) {//for loop to display cryptocurrencies[] on the table
    var $item = $(
      "<tr class='cryptocurrency'>" +
      "<th class='rank'>" + (i + 1) + "</th>" +
      "<td class='name'>" + cryptocurrencies[i].name + "</td>" +
      "<td class='symbol'>" + cryptocurrencies[i].symbol + "</td>" +
      "<td class='price'>" + cryptocurrencies[i].price + "</td>" +
      "<td class='market_cap'>" + cryptocurrencies[i].market_cap + "</td>" +
      "<td class='volume_24h'>" + cryptocurrencies[i].volume_24h + "</td>" +
      "<td class='percentage_change_24h'>" + cryptocurrencies[i].percentage_change_24h + "</td>" +
      "</tr>"
    );
    cryptocurrencies[i].$item = $item;//sets as new item            
    $list.append($item);
  }
  var table = document.querySelector('#coins_table');
  var rows = table.querySelector("#cryptocurrencies");



  //-----------------------open coins modal--------------------------
  document.querySelectorAll('#cryptocurrencies tr').forEach(selected => {
    selected.addEventListener("click", () => {

      document.querySelector(".coin-modal-preloader").style.display = 'flex'


      setTimeout(function wait() {
        document.querySelector(".coin-modal-preloader").style.display = 'none'
        document.querySelector(".coin-modal").style.display = 'flex'
      }, 1300);

      //document.querySelector(".coin-modal").style.display = 'flex'



      selected_rank = selected.rowIndex;
      if (cryptocurrencies[selected_rank - 1].percentage_change_24h.toFixed(2).charAt(0) == '-') {
        document.querySelector('.modal-percentage').classList.toggle("negative");
      }


      document.querySelector('#modal-image').src = cryptocurrencies[selected_rank - 1].image
      document.querySelector('.modal-name').innerText = cryptocurrencies[selected_rank - 1].name;
      document.querySelector('#modal_percentage_value').innerText = cryptocurrencies[selected_rank - 1].percentage_change_24h.toFixed(3);
      document.querySelector('.modal-marketcap-value').innerText = cryptocurrencies[selected_rank - 1].market_cap
      document.querySelector('.modal-price-value').innerText = cryptocurrencies[selected_rank - 1].price
      document.querySelector('.modal-volume-value').innerText = cryptocurrencies[selected_rank - 1].volume_24h



      document.querySelector('#modal-close').addEventListener("click", () => {
        document.querySelector(".coin-modal").style.display = 'none'
        document.querySelector('.modal-percentage').classList.remove("negative");


      });


      displaychart(cryptocurrencies[selected_rank - 1].id);
      //document.querySelector("#selectedcoin").innerText = cryptocurrencies[selected_rank-1].name;
    });
    selected.addEventListener('mouseover', () => {
      selected.style.backgroundColor = "#282828";


    })
    selected.addEventListener('mouseout', () => {
      selected.style.backgroundColor = "#333";
    })
  });


  var cotd_data = [];
  for (let i = 0; i < numOfCoins; i++) {//for loop to make push into array for coin of the day
    cotd_data.push(
      {
        name: data[i].name,
        price: data[i].current_price,
        percentage_change_24h: data[i].market_cap_change_percentage_24h,
        image: data[i].image
      }
    )
  }
  for (let i = 0; i < cotd_data.length - 1; i++) {
    for (let j = i + 1; j < cotd_data.length; j++) {
      if (cotd_data[j].percentage_change_24h > cotd_data[i].percentage_change_24h) {
        let temp = cotd_data[i];
        cotd_data[i] = cotd_data[j];
        cotd_data[j] = temp;
      }
    }
  }

  document.querySelector('.cotd_coin').innerHTML = cotd_data[0].name;
  document.querySelector('#cotd_price_value').innerHTML = cotd_data[0].price;
  document.querySelector('#cotd_percentage_value').innerHTML = cotd_data[0].percentage_change_24h;
  document.querySelector('.cotd_image').src = cotd_data[0].image;


}

resetBoard(status);//default status is market_cap_dec


function displaychart(coinid) {


  var data24h = new XMLHttpRequest();
  var data7d = new XMLHttpRequest();
  var data1M = new XMLHttpRequest();
  var data3M = new XMLHttpRequest();
  var data1Y = new XMLHttpRequest();

  //----------------------------------------fetch data for 24h chart
  data24h.open("GET", "https://api.coingecko.com/api/v3/coins/" + coinid + "/market_chart?vs_currency=usd&days=1%20&interval=hourly", false);//hourly 24h data
  data24h.send(null);
  var chart24h = JSON.parse(data24h.responseText);
  var prices24h = [];
  var prices24h_time = [];
  for (let i = 0; i < chart24h.prices.length; i++) {
    prices24h.push(chart24h.prices[i][1])//creates seperate array extracting the prices from data
  }

  let counter = chart24h.prices.length;
  var currentDate = new Date();
  var prev1day = new Date();
  prev1day.setDate(currentDate.getDate() - 1);

  for (let j = 0; j < chart24h.prices.length; j++) {
    var current_time = currentDate.getHours() - counter + 1
    var current_date = currentDate.toLocaleDateString()
    if (current_time < 0) {
      current_time += chart24h.prices.length
      current_date = prev1day.toLocaleDateString()
    }
    prices24h_time.push(current_date + " " + current_time + ":00")
    counter--;
  }
  console.log(prices24h)
  console.log(prices24h_time)
  //-------------------prices stored in prices24h[], dates stored in prices24h_time[]  

  //------------------------------fetch data for 7d chart------------------------

  data7d.open("GET", "https://api.coingecko.com/api/v3/coins/" + coinid + "/market_chart?vs_currency=usd&days=7&interval=hourly", false);//hourly 7d data
  data7d.send(null);
  var chart7d = JSON.parse(data7d.responseText);
  var prices7d = [];
  var prices7d_time = [];
  for (let i = 0; i < chart7d.prices.length; i++) {
    prices7d.push(chart7d.prices[i][1])//creates seperate array extracting the prices from data
  }
  let counter7d = chart7d.prices.length
  var currentDate = new Date();
  var date = new Date();
  var current_day = new Date();
  var daycounter = 7;
  for (let j = 0; j < chart7d.prices.length; j++) {

    currentDate.setHours(date.getHours() - counter7d + 1)//sets the hour depending on how far it is from the current hour
    current_day.setDate(date.getDate() - daycounter);

    if (currentDate.getHours() == 23) {//starts at 7 days away, decrements days when the time hits 23:00 (end of day)
      daycounter--
    }

    prices7d_time.push(current_day.toLocaleDateString() + " " + currentDate.getHours() + ":00")
    counter7d--//decrements the day counter
  }

  console.log(prices7d)
  console.log(prices7d_time)
  //------------------------------------------------------------------------------------------

  //------------------------------fetch data for 1M chart------------------------
  data1M.open("GET", "https://api.coingecko.com/api/v3/coins/" + coinid + "/market_chart?vs_currency=usd&days=30&interval=hourly", false);//daily 30d data
  data1M.send(null);
  var chart1M = JSON.parse(data1M.responseText);
  var prices1M = [];
  var prices1M_time = [];
  for (let i = 0; i < chart1M.prices.length; i++) {
    prices1M.push(chart1M.prices[i][1])//creates seperate array extracting the prices from data
  }
  let counter1M = chart1M.prices.length
  var currentDate1 = new Date();
  var current_day1 = new Date();
  var date1 = new Date();
  current_day1.setMonth(date.getMonth() - 1);
  var days = []//second array to store date of each hour, array needed as overwriting setDate() causes issues with date
  var daycounter1 = 30;
  for (let j = 0; j < chart1M.prices.length; j++) {
    currentDate1.setHours(date1.getHours() - counter1M + 1)//sets the hour depending on how far it is from the current hour
    days[j] = new Date();
    days[j].setDate(date1.getDate() - daycounter1)

    if (currentDate1.getHours() == 23) {
      daycounter1--//if reached end of day, decrement days to subtract
    }



    prices1M_time.push(days[j].toLocaleDateString() + " " + currentDate1.getHours() + ":00")
    counter1M--//decrements the day counter
  }

  console.log(prices1M)
  console.log(prices1M_time)

  //------------------------------------------------------------------------------------------


  //------------------------------fetch data for 3M chart------------------------
  data3M.open("GET", "https://api.coingecko.com/api/v3/coins/" + coinid + "/market_chart?vs_currency=usd&days=90&interval=daily", false);//daily 90d data
  data3M.send(null);
  var chart3M = JSON.parse(data3M.responseText);
  var prices3M = [];
  var prices3M_time = [];
  for (let i = 0; i < chart3M.prices.length; i++) {
    prices3M.push(chart3M.prices[i][1])//creates seperate array extracting the prices from data
  }

  var counter3M = chart3M.prices.length - 1;
  var date3M = new Date();
  var days3M = [];
  for (let i = 0; i < chart3M.prices.length; i++) {

    days3M[i] = new Date();
    days3M[i].setDate(date1.getDate() - counter3M)
    counter3M--
    prices3M_time.push(days3M[i].toDateString())
  }
  console.log(prices3M)
  console.log(prices3M_time)

  //------------------------------------------------------------------------------------------


  //------------------------------fetch data for 1Y chart------------------------
  data1Y.open("GET", "https://api.coingecko.com/api/v3/coins/" + coinid + "/market_chart?vs_currency=usd&days=365&interval=daily", false);//weekly 1Y data
  data1Y.send(null);
  var chart1Y = JSON.parse(data1Y.responseText);
  var prices1Y = [];
  var prices1Y_time = [];
  for (let i = 0; i < chart1Y.prices.length; i++) {
    prices1Y.push(chart1Y.prices[i][1])//creates seperate array extracting the prices from data
  }
  var counter1Y = chart1Y.prices.length - 1;
  var date1Y = new Date();
  var days1Y = [];
  for (let i = 0; i < chart1Y.prices.length; i++) {

    days1Y[i] = new Date();
    days1Y[i].setDate(date1.getDate() - counter1Y)
    counter1Y--
    prices1Y_time.push(days1Y[i].toDateString())
  }
  console.log(prices1Y)
  console.log(prices1Y_time)


  //------------------------------------------------------------------------------------------


  let myChart = null;//initialized the chart to null

  chartIt(prices24h_time, prices24h)//on load 24h chart is displayed
  function destroychart() {
    const ctx = document.getElementById('modal-chart').getContext('2d');

    myChart.destroy();

  }

  function chartIt(x, y, point_radius) {
    const ctx = document.getElementById('modal-chart').getContext('2d');


    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: x,
        beginAtZero: true,
        datasets: [{
          label: 'Price (USD)',
          data: y,
          backgroundColor: ['rgba(247,202,20, 1)',

          ],
          borderColor: ['rgba(247,202,20, 1)',],
          borderWidth: 2
        }]
      },
      options: {
        tooltips: {

          mode: 'index',
          axis: 'x'
        },
        elements: {
          point: {
            radius: point_radius
          }
        },

      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 14,
          }
        }
      }
    });

    document.querySelector('#modal-close').addEventListener("click", () => {
      myChart.destroy();
    });

  }


  document.querySelector('#btn24h').addEventListener('click', () => {
    destroychart();
    chartIt(prices24h_time, prices24h, 2)


  });

  document.querySelector('#btn7d').addEventListener('click', () => {
    destroychart();
    chartIt(prices7d_time, prices7d, 0.8)


  });

  document.querySelector('#btn1M').addEventListener('click', () => {
    destroychart();

    chartIt(prices1M_time, prices1M, 0)

  });

  document.querySelector('#btn3M').addEventListener('click', () => {
    destroychart();

    chartIt(prices3M_time, prices3M, 0)

  });

  document.querySelector('#btn1Y').addEventListener('click', () => {
    destroychart();

    chartIt(prices1Y_time, prices1Y, 0)


  });

}



