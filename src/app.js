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
  let locationElement = document.querySelector("#location-name");
  locationElement.innerHTML = response.data.name;
  let temperatureElement = document.querySelector("#temperature-num");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;
  let dateTimeElement = document.querySelector("#date-time");
  dateTimeElement.innerHTML = formatDateTime(response.data.timezone);
}

let apiKey = "c904083ce9d848d6eee6931b635cd191";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Honolulu&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayWeatherData);
