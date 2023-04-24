
const apiKey = "your-api-key";

const locationForm = document.querySelector("#location-form");
const locationInput = document.querySelector("#location-input");
const currentWeather = document.querySelector(".current-weather");
const locationEl = document.querySelector(".location");
const temperatureEl = document.querySelector(".temperature");
const descriptionEl = document.querySelector(".description");
const iconEl = document.querySelector(".icon");
const forecastEl = document.querySelector(".forecast-data");
const wind = document.querySelector('.wind');
const tempfeels = document.querySelector('.tempfeels');
const pressure = document.querySelector('.pressure');
const humidity = document.querySelector('.humidity');



locationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const location = locationInput.value;
  getWeather(location);
});


async function getWeather(location) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
  const data = await response.json();


  locationEl.textContent = `${data.name},${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;

  
  wind.textContent =`prędkość wiatru: ${data.wind.speed}`;
  tempfeels.textContent=`temperatura odczuwana: ${data.main.feels_like}`;
  pressure.textContent=`ciśnienie: ${data.main.pressure} hPa`;
  humidity.textContent=`wilgotność: ${data.main.humidity}%`;
  let currentWeatherEL=``;
  const iconCod = data.weather[0].icon

  const iconcodUrl = `https://openweathermap.org/img/w/${iconCod}.png`;
  currentWeatherEL += `<img class="weather-icon" src="${iconcodUrl}">`;
  currentWeather.innerHTML+=currentWeatherEL;
  
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
  const forecastData = await forecastResponse.json();


  let forecastHtml = "";
  let filteredForecastData = forecastData.list.filter((item) => {
  return item.dt_txt.includes("12:00:00");
});
let labels = [];
let tempdata = [];
let winddata = [];
let tempfeeldata = [];
let pressuredata=[];
let humiditydata=[];


filteredForecastData.forEach((item) => {
  const date = new Date(item.dt * 1000);
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
  const temperature = `${Math.round(item.main.temp)}°C`;
  const description = item.weather[0].description;
  const iconCode = item.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
  forecastHtml += `
    <div class="forecast-item">
      <div class="forecast-day">${dayOfWeek}</div>
      <img class="forecast-icon" src="${iconUrl}">
      <div class="forecast-temp">${temperature}</div>
      <div class="forecast-desc">${description}</div>
    </div>
  `;
  labels.push(date.toLocaleString("en-US", { weekday: "short" }) );
  tempdata.push(Math.round(item.main.temp));
  winddata.push(item.wind.speed);
  tempfeeldata.push(Math.round(item.main.feels_like));
  pressuredata.push(item.main.pressure);
  humiditydata.push(item.main.humidity);
});
  forecastEl.innerHTML = forecastHtml;


  // Clear input field
  locationInput.value = "";

//wykresy
const temperatureChart = document.querySelector("#temperature-chart");
const windChart = document.querySelector("#wind-chart");
const tempfeelsChart = document.querySelector("#tempfeels-chart");
const pressureChart= document.querySelector("#pressure-chart");
const humidityChart = document.querySelector("#humidity-chart");
  const tempchart = new Chart(temperatureChart, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperatura",
          data: tempdata,
          fill: false,
          backgroundColor: 'rgba(65, 105, 255, 0.2)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Wyker temperatury w ciągu 5 dni",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  const windart = new Chart(windChart, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "prędkość wiatru",
          data: winddata,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "prędkość wiatru w km/h",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  
  const tempfeelchart = new Chart(tempfeelsChart, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperatura",
          data: tempdata,
          fill: false,
         
          backgroundColor: 'rgba(65, 105, 255, 0.5)',
        
        },{
            type: 'bar',
            label: 'odczuwalna',
            data:tempfeeldata,
           
            backgroundColor: 'rgb(255, 99, 132, 0.5)',
        }
      ],

    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Porównanie temperatury z temperaturą odczuwalną",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  const pressurechart = new Chart(pressureChart, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "ciśnienie",
          data: pressuredata,
          fill: false,
          backgroundColor: 'rgba(65, 105, 255, 0.4)',
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Wyker ciśnienia w ciągu 5 dni",
        },
      },
      scales: {
        x: {
          beginAtZero: false,
          suggestedMin: 900,
          suggestedMax: 1100,
        },
      },
    },
  });
  const humiditychart = new Chart(humidityChart, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "wilgotność",
          data: humiditydata,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "% wilgotności w ciągu 5 dni",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: 20,
        },
      },
    },
  });
  
}



