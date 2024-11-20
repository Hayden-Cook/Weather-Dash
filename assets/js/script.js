const keyAPI = '7e7a5831fdc2f2cc70d38b8284d76c8b'

$(document).ready(function () {
    $("searchButton").on("click", function () {
        let city = $("#cityInput").val().trim();
        if (city) {
            getCoordinates(city);
        }
    });

    updateSearchHistory();
});

const getCoordinates = (city) => {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${keyAPI}`;
    $.getJSON(geoUrl)
    .done((data) => {
        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeather(lat, lon, city);
        } else {
            alert("City not found. Please try again.");
        }
    })
    .fail(() => {
        alert("Error fetching coordinates. Please try again.");
    });
};

const getWeather = (lat, lon, city) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyAPI}&units=imperial`;
    $.getJSON(weatherUrl)
    .done((data) => {
        displayCurrentWeather(data, city);
        displayForecast(data);
        saveCityToLocalStorage(city);
        updateSearchHistory(city);
    })
    .fail(() => {
        alert("Error fetching weather data. Please try again.");
    });
};

const displayCurrentWeather = (data, city) => {
    const current = data.list[0];
    $("#currentWeather").html(`
        <h2>${city} (${new Date().toLocaleDateString()})</h2>
        <img src="https://openweathermap.org/img/w/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
        <p>Temp.: ${current.main.temp} °F</p>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind Speed: ${current.wind.speed} MPH</p>
    `);
};

const displayForecast = (data) => {
    const forecastContainer = $("#forecast");
    forecastContainer.empty();

    for (let i = 1; i < data.list.length; i+=8) {
        const forecast = data.list[i];
        forecastContainer.append(`
            <div class="forecast-card">
                    <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
                    <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                    <p>Temp.: ${day.main.temp} °F</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                    <p>Wind Speed: ${day.wind.speed} MPH</p>
            </div>
        `);
    }
};

const saveCityToLocalStorage = (city) => {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    updateSearchHistory();
};

const updateSearchHistory = () => {
    const searchHistoryElement = $("#searchHistory");
    const cities = JSON.parse(localStorage.getItem("cities")) || [];

    searchHistoryElement.empty();

    cities.forEach((city) => {
        const listItem = $("<li>").text(city);
        listItem.on("click", function () {
            getCoordinates(city);
        });
        searchHistoryElement.append(listItem);
    });
};
