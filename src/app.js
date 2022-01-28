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
}

let apiKey = "c904083ce9d848d6eee6931b635cd191";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayWeatherData);
