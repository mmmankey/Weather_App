//$(function() {

//Initialize Firebase
var config = {
apiKey: "AIzaSyAGzYAy0ax5SPMLcaTkci9QCxgcyHbFmss",
authDomain: "bluewolf-weather-app.firebaseapp.com",
databaseURL: "https://bluewolf-weather-app.firebaseio.com",
projectId: "bluewolf-weather-app",
storageBucket: "bluewolf-weather-app.appspot.com",
messagingSenderId: "512605531378"
};
firebase.initializeApp(config);



//get weather from forecast.io
function getWeather(latitude, longitude) {
  var apiKey = '511c88ab029850958b50a3eef9b176d9',
      url = 'https://api.darksky.net/forecast/',
      lat = latitude,
      long = longitude,
      apiCall = url + apiKey + "/" + lat + "," + long + "?extend=hourly&callback=?";
      //console.log('date ', date.getTime())
      //console.log('date ', date.toUTCString())
      //console.log( 'api call ', apiCall );

  //function to setup skycons
  function skycons() {
    var icons = new Skycons({"color": "#000000",
                             "resizeClear" : "true"
        }),

        list = [
        "clear-day",
				"clear-night",
				"partly-cloudy-day",
				"partly-cloudy-night",
				"cloudy",
				"rain",
				"sleet",
				"snow",
				"wind",
				"fog"
      ];

    for(var i = list.length; i--;) {
      var condition = list[i];
      var elements = document.getElementsByClassName( condition );

      for(var j = elements.length; j--;) {
        icons.add(elements[j], condition);
      }
    }

    icons.play();
  }

  $.getJSON(apiCall, function(forecast) {

/*---------------------------Daily Forecast-----------------------------------*/
      //Variables for getting current forecast
      var currDate = new Date(forecast.daily.data[0].time * 1000),
          tempCurr = Math.round( forecast.hourly.data[0].temperature ),
          currConditions = forecast.hourly.data[0].summary,
          tempHigh = Math.round( forecast.daily.data[0].temperatureHigh ),
          tempLow = Math.round( forecast.daily.data[0].temperatureLow );
          console.log(forecast);

       $('#mainForm').fadeOut(100);
       $('#forecast').fadeIn(500);
      $('#forecastDate').prepend(
          '<p class="text-left" id="date"><b>' + currDate.toDateString() + '</b></p>' +
          '<p class="text-left" id="summary"><small>' + currConditions + '</small></p>' +
          '<p class="text-left" id="currTemp"><b>Currently: </b>' + tempCurr + '&deg;F</p>'
      );
      $('#forecastData #rowHigh').prepend(
        '<p class="text-left" id="tempHigh"><b>High: </b>' + tempHigh + '&deg;F</p>'
      );
      $('#forecastData #rowLow').prepend(
        '<p class="text-left" id="tempLow"><b>Low: </b>' + tempLow + '&deg;F</p>'
      );

/*-----------------------End Daily Forecast-----------------------------------*/

/*---------------------------Hourly Forecast----------------------------------*/
      //Variales for getting hourly forecast
      var hoursOfDay = [];
          numHours = 24;

      for(var i = 0; i < numHours; i++) {
        var hourlyDate = new Date(forecast.hourly.data[i].time * 1000),
            hour = convertHours( hourlyDate.getHours() ),
            condition = forecast.hourly.data[i].icon,
            hourlyTemp = Math.round( forecast.hourly.data[i].temperature);

        $('#hourlyForecastRow').append(
          '<div class="hourlyGroup">' +
            '<div id="hourlyHour">' + hour + '</div>' +
            '<div id="hourlyCondition"><canvas class="' + condition +'" width="16" height="16"></canvas></div>' +
            '<div id="hourlyTemp">' + hourlyTemp + '</div>' +
          '</div>'
        )
        // $('#conditionRow').append(
        //   '<div class="hourlyGroup" id="hourlyCondition"><canvas class="' + condition + '" width="16" height="16"></canvas></div>'
        // )
      }
/*-----------------------End Hourly Forecast----------------------------------*/


/*--------------------------Weekly Forecast-----------------------------------*/
      //Variables for getting 7 Day forecast

      var sunday = [],
          monday = [],
          tuesday = [],
          wednesday = [],
          thursday = [],
          friday = [],
          saturday = [];

    //array to map days to indexes 0-7
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    //populate arrays with pertinant data
    for(var i=1; i<forecast.daily.data.length; i++) {
      var weeklyDate = new Date(forecast.daily.data[i].time * 1000),
          dayOfWeek = weeklyDate.getDay(),
          dayString = daysOfWeek[dayOfWeek],
          condition = forecast.daily.data[i].icon,
          dayHigh = Math.round( forecast.daily.data[i].temperatureHigh ),
          dayLow = Math.round( forecast.daily.data[i].temperatureLow );


      $('#dayOfWeek').append(
        '<p class="text-left" id="dayOfWeek"><b>' + dayString + '</b></p>'
      )
      $('#icon').append(
        '<p class="text-left" id="dayCondition"><canvas class="' + condition + '" width="16" height="16"></canvas></p>'
      )
      $('#weekdayTemp').append(
        '<p class="text-left" id="tempHighLow">' + dayHigh + '&deg;F &nbsp&nbsp&nbsp' + dayLow + '&deg;F</p>'
      )
    }

    //place skycons into elements with class=(value of condtion)
    skycons();

/*-----------------------End Weekly Forecast----------------------------------*/

  });
}

function convertHours(hour) {
  if(hour == 0){
    hour = '12AM';
  }
  else if(hour > 12) {
    hour -= 12;
    hour += 'PM';
  }
  else {
    hour += 'AM';
  }
  return hour;
}

function getPastFuture(latitude, longitude) {
  var apiKey = '511c88ab029850958b50a3eef9b176d9',
      url = 'https://api.darksky.net/forecast/',
      lat = latitude,
      long = longitude,
      curDate = new Date(),
      years = [],
      forecasts = [];

      //loop to get the previous 10 years and push in to array
  for(var i = 1; i <= 10; i++) {
    years.push( curDate.getFullYear() - i );
    //onsole.log(date.getFullYear() - i );
  }

  //push in the current years
  years.push( curDate.getFullYear() );

  //push in the next 10 future years
  for(var i = 1; i <= 10; i++) {
    years.push( curDate.getFullYear() + i );
  }

  var promises = [];

    for(var i = 0; i < years.length; i++) {

      var forecastPromise = new Promise(function(resolve, reject) {
      var tempDate = new Date();
      tempDate.setYear( years[i] );
      var apiCall = url + apiKey + "/" + lat + "," + long + "," + ( Math.round( tempDate.getTime() / 1000 ) ) + "?callback=?";

      try {
        $.getJSON(apiCall, function(forecast) {

            var forecastDate = new Date(forecast.daily.data[0].time * 1000),
                temperatureHigh = forecast.daily.data[0].temperatureMax,
                temperatureLow = forecast.daily.data[0].temperatureMin,
                precipProb = forecast.daily.data[0].precipProbability,
                humidity = forecast.daily.data[0].humidity;

            // $('body').append(
            //     '<div>' + forecastDate + '</div>' +
            //     '<div>' + temperature + '</div>'
            forecasts.push( [forecastDate.getFullYear(), temperatureHigh, temperatureLow, precipProb, humidity] );

            if(forecasts.length != 0) {
              resolve([forecastDate.getFullYear(), temperatureHigh, temperatureLow, precipProb, humidity]);
              console.log('resolve');
            }
            else {
              var reason = new Error('forecasts undefined');
              reject(reason);
            }
            console.log(forecasts.length);


          //console.log(forecasts[i][0]);
        });

      }
      catch (e) {
        alert('Historical data is unavailable');
      }
    });
      promises.push(forecastPromise);
    }

  return promises;
}



// function injectGoogle() {
//   var apiCall = document.createElement('script'),
//       apiKey = 'AIzaSyAKbYTvZq2ywrElGBUKk-t-y7tmw6r7edk';
//
//   apiCall.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=startGoogleSearchBox&libraries=places,geometry";
//   document.body.appendChild(apiCall);
// }

//GoogleMaps Searchbox
// function startGoogleSearchBox() {
//   //insert api call in to HTML
//
//
//   var searchBox = new google.maps.places.SearchBox(document.querySelector("cityName"));
//
//   searchBox.addListener('places_changed', function(){
//     var place = searchBox.getPlaces()[0];
//     document.querySelector("#latitude").value = place.geometry.location.lat();
//     document.querySelector("#longitude").value = place.geometry.location.lng();
//   });
// }

//injectGoogle();
//startGoogleSearchBox();
//});
