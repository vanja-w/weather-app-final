function formatDateTime(timezone) {
  let currentDate = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];

  let date = currentDate.getDate();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[currentDate.getMonth()];

  let year = currentDate.getFullYear();

  let hours = currentDate.getUTCHours() + timezone / 3600;
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${day}, ${date} ${month} ${year} | ${hours}:${minutes}`;
}

//function that fetches daily forecast API data
function getForecast(coordinates) {
  let apiKey = "c904083ce9d848d6eee6931b635cd191";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherData(response) {
  document.querySelector("#location-name").innerHTML = response.data.name;
  document.querySelector("#temperature-num").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#date-time").innerHTML = formatDateTime(
    response.data.timezone
  );
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "class",
      `wi ${getWeatherIcon(weatherIcon, response.data.weather[0].id)}`
    );

  celsiusTemp = response.data.main.temp;

  //calling daily forecest function
  getForecast(response.data.coord);
}

//create object for weather condition codes
const weatherIcon = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-rain",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Smoke: "wi-smoke",
  Haze: "wi-day-haze",
  Dust: "wi-dust",
  Fog: "wi-fog",
  Sand: "wi-sandstorm",
  Tornado: "wi-tornado",
  Clear: "wi-day-sunny",
  FewClouds: "wi-day-cloudy",
  ScatteredCloud: "wi-cloud",
  Clouds: "wi-cloudy",
};

//function that generates a suitable weather icon based on the weather id retrieved from the API
function getWeatherIcon(weatherIcon, rangeId) {
  if (rangeId >= 200 && rangeId <= 232) {
    return weatherIcon.Thunderstorm;
  } else if (rangeId >= 300 && rangeId <= 321) {
    return weatherIcon.Drizzle;
  } else if (rangeId >= 500 && rangeId <= 531) {
    return weatherIcon.Rain;
  } else if (rangeId >= 600 && rangeId <= 622) {
    return weatherIcon.Snow;
  } else if (rangeId == 701 || rangeId == 762 || rangeId == 771) {
    return weatherIcon.Atmosphere;
  } else if (rangeId == 711) {
    return weatherIcon.Smoke;
  } else if (rangeId == 721) {
    return weatherIcon.Haze;
  } else if (rangeId == 731 || rangeId == 761) {
    return weatherIcon.Dust;
  } else if (rangeId == 741) {
    return weatherIcon.Fog;
  } else if (rangeId == 751) {
    return weatherIcon.Sand;
  } else if (rangeId == 781) {
    return weatherIcon.Sand;
  } else if (rangeId == 800) {
    return weatherIcon.Clear;
  } else if (rangeId == 801) {
    return weatherIcon.FewClouds;
  } else if (rangeId == 802) {
    return weatherIcon.ScatteredCloud;
  } else if (rangeId == 803 || rangeId == 804) {
    return weatherIcon.Clouds;
  }
}

//Checks if input is empty, has spaces or is a digit. IMPORTANT -> Find solution for special chars!!
function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null || /^\d+$/.test(str);
}

function searchLocation(userLocationInput) {
  let apiKey = "c904083ce9d848d6eee6931b635cd191";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userLocationInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherData);
}

function handleSubmit(event) {
  event.preventDefault();
  let userLocationInput = document.querySelector("#search-text-input");
  if (isEmptyOrSpaces(userLocationInput.value)) {
    alert(`Invalid input!`);
  } else {
    document.querySelector("#location-name").innerHTML =
      userLocationInput.value.replace(
        //returns every string's first char capitalized / title case
        /(^|[\s-])\S/g,
        function (match) {
          return match.toUpperCase();
        }
      );
  }
  searchLocation(userLocationInput.value);
}

//show on load before user's geoLoc loads
searchLocation("Berlin");

//shows real-time weather data for user's location on load
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "c904083ce9d848d6eee6931b635cd191";
  let apiGeoUrl = "https://api.openweathermap.org/data/2.5/weather?";
  axios
    .get(`${apiGeoUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(displayWeatherData);
}

navigator.geolocation.getCurrentPosition(showPosition);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

//convert Celsius into Fahrenheit
function showFahrenheitTemp(event) {
  event.preventDefault();
  celsiusTag.classList.remove("active");
  fahrenheitTag.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  document.querySelector("#temperature-num").innerHTML =
    Math.round(fahrenheitTemp);
}

//convert Fahrenheit into Celsius
function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusTag.classList.add("active");
  fahrenheitTag.classList.remove("active");
  document.querySelector("#temperature-num").innerHTML =
    Math.round(celsiusTemp);
}

let celsiusTag = document.querySelector("#celsiusTag");
celsiusTag.addEventListener("click", showCelsiusTemp);

let fahrenheitTag = document.querySelector("#fahrenheitTag");
fahrenheitTag.addEventListener("click", showFahrenheitTemp);

//display weather forecast table
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  //loop through array in daily and inject html with JS accordingly
  forecast.forEach(function (forecastDay, index) {
    if (index < 4) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
              <div class="weather-forecast-day">${formatDay(
                forecastDay.dt
              )}</div>
              <div class="weather-forecast-icon">
              <i id="weather-icon-forecast" class="wi ${getWeatherIcon(
                weatherIcon,
                forecast[index].weather[0].id
              )} "></i></div>
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-temp-max">${Math.round(
                  forecastDay.temp.max
                )}°C |</span>
                <span class="weather-forecast-temp-min">${Math.round(
                  forecastDay.temp.min
                )}°C</span>
              </div>
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  //format timestamp/datatime into days
  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }
}
