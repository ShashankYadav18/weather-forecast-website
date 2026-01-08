const apiKey = "b76c59d85338ea62cba3754cdf51543a"; // OpenWeather API key

function getCustomIcon(code) {
  const map = {
    "01d": "https://img.icons8.com/emoji/96/sun-emoji.png", // clear day
    "01n": "https://img.icons8.com/emoji/96/full-moon-emoji.png", // clear night
    "02d": "https://img.icons8.com/emoji/96/sun-behind-cloud.png", // partly cloudy
    "02n": "https://img.icons8.com/emoji/96/cloud-emoji.png",
    "03d": "https://img.icons8.com/emoji/96/cloud-emoji.png", // cloudy
    "03n": "https://img.icons8.com/emoji/96/cloud-emoji.png",
    "04d": "https://img.icons8.com/emoji/96/cloud-emoji.png", // broken clouds
    "04n": "https://img.icons8.com/emoji/96/cloud-emoji.png",
    "09d": "https://img.icons8.com/emoji/96/cloud-with-rain.png", // showers
    "09n": "https://img.icons8.com/emoji/96/cloud-with-rain.png",
    "10d": "https://img.icons8.com/emoji/96/cloud-with-rain.png", // rain
    "10n": "https://img.icons8.com/emoji/96/cloud-with-rain.png",
    "11d": "https://img.icons8.com/emoji/96/cloud-with-lightning.png", // thunderstorm
    "11n": "https://img.icons8.com/emoji/96/cloud-with-lightning.png",
    "13d": "https://img.icons8.com/emoji/96/cloud-with-snow.png", // snow
    "13n": "https://img.icons8.com/emoji/96/cloud-with-snow.png",
    "50d": "https://img.icons8.com/emoji/96/fog.png", // mist
    "50n": "https://img.icons8.com/emoji/96/fog.png"
  };
  return map[code] || "https://img.icons8.com/emoji/96/cloud-emoji.png"; // fallback
}

// ✅ Animated favicon updater
function updateFavicon(iconUrl) {
  const favicon = document.getElementById("favicon");

  // Temporary "loading" spinner 🌪️
  favicon.href = "https://img.icons8.com/emoji/48/cyclone.png";

  // Swap to weather icon after 300ms
  setTimeout(() => {
    favicon.href = iconUrl;
  }, 300);
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  let query = city.toLowerCase() === "lucknow" ? "lucknow,in" : city;

  if (!city) return alert("Enter a city name!");

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`;

  const weatherRes = await fetch(weatherURL);
  const weatherData = await weatherRes.json();

  if (weatherData.cod !== 200) return alert("City not found!");

  // Update main weather info
  document.getElementById("cityName").innerText = weatherData.name;
  document.getElementById("temp").innerText = `${Math.round(weatherData.main.temp)} °C`;
  document.getElementById("desc").innerText = weatherData.weather[0].description;

  const mainIcon = getCustomIcon(weatherData.weather[0].icon);
  document.getElementById("icon").src = mainIcon;

  document.getElementById("weatherResult").classList.remove("hidden");

  // 🌟 Update favicon dynamically with animation
  updateFavicon(getCustomIcon(weatherData.weather[0].icon));

  // 7-day forecast (using 3-hour forecast API)
  const forecastRes = await fetch(forecastURL);
  const forecastData = await forecastRes.json();

  let forecastCards = document.getElementById("forecastCards");
  forecastCards.innerHTML = "";

  for (let i = 0; i < forecastData.list.length; i += 8) {
    let day = forecastData.list[i];
    let card = `
      <div class="card">
        <h3>${new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: 'short' })}</h3>
        <img src="${getCustomIcon(day.weather[0].icon)}">
        <p>${Math.round(day.main.temp)} °C</p>
      </div>
    `;
    forecastCards.innerHTML += card;
  }
}
