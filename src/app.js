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

function displayWeatherData(response) {
  console.log(response.data);
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
}

//create object for weather condition codes
const weatherIcon = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-rain",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Cloud: "wi-cloudy",
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
  } else if (rangeId >= 701 && rangeId <= 781) {
    return weatherIcon.Atmosphere;
  } else if (rangeId == 800) {
    return weatherIcon.Clear;
  } else if (rangeId >= 801 && rangeId <= 804) {
    return weatherIcon.Cloud;
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
    console.log(userLocationInput.value);
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

  let apiKey = "84617a2d9f6cdc8070faab840a39470e";
  let apiGeoUrl = "https://api.openweathermap.org/data/2.5/weather?";
  axios
    .get(`${apiGeoUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(displayWeatherData);
}

navigator.geolocation.getCurrentPosition(showPosition);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function showFahrenheitTemp(event) {
  event.preventDefault();
  celsiusTag.classList.remove("active");
  fahrenheitTag.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  document.querySelector("#temperature-num").innerHTML =
    Math.round(fahrenheitTemp);
}

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
