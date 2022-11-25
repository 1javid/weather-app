$(window).on('load', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
});

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

    findWeather(latitude, longitude);
}

function findWeather(latitude, longitude) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9573f03a457a72999cd19e9b55cc7767&units=metric`)
        .then((response) => {
            console.log(response);

            let city = response.data.name;
            let weatherCondition = response.data.weather[0].main;
            let weatherConditionDescription = response.data.weather[0].description;

            let temp = response.data.main.temp;
            let tempMax = response.data.main.temp_max;
            let tempMin = response.data.main.temp_min;

            let feelsLike = response.data.main.feels_like;
            let humidity = response.data.main.humidity;
            let pressure = response.data.main.pressure;

            let windSpeed = response.data.wind.speed;
            let windDeg = response.data.wind.deg;
            let windDirection = getDirection(windDeg);

            let unix = response.data.dt;
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            let date = new Date(unix * 1000);

            let localTime = date.toLocaleTimeString("en-US")
            let localDate = date.toLocaleDateString("en-US");

            getFullCountryName(city.split(" ")[0]);

            $('.weather-details').append(`  <div class="inner-main-containers">
                                                <div id="importantContainer">
                                                    <h2>${Math.ceil(temp)}<sup>°</sup>C</h2>
                                                    <hr />
                                                    <h3>${weatherCondition} - ${weatherConditionDescription}</h3>
                                                    <hr />
                                                    <div> 
                                                        <h4>H: ${Math.ceil(tempMax)}<sup>°</sup>C</h4>
                                                        <h4>L: ${Math.ceil(tempMin)}<sup>°</sup>C</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="inner-detail-containers">
                                                <div id="feelsLikeContainer">
                                                    <p>Feels like</p>
                                                    <h4>${Math.ceil(feelsLike)}<sup>°</sup>C</h4>
                                                </div>
                                                <div id="humidityContainer">
                                                    <p>Humidity</p>
                                                    <h4>${humidity}%</h4>
                                                </div>
                                                <div id="pressureContainer">
                                                    <p>Pressure</p>
                                                    <h4>${pressure} hPA</h4>
                                                </div>
                                                <div id="windSpeedContainer">
                                                    <p>Wind</p>
                                                    <h4>${windSpeed} km/h ${windDirection}</h4>
                                                </div>
                                            </div>
                                            <div class="inner-footer-containers">
                                            <div id="timeContainer">${localTime} ${localDate}</div>
                                            </div>`);
        })
}

function getFullCountryName(city) {
    axios.get(`https://restcountries.com/v3.1/capital/${city}`)
        .then((response) => {
            let country = response.data[0].altSpellings[1];
            $('.weather-head').append(`<h1><i>${country}, ${city}</i></h1>`);
        })
}

function getDirection(angle) {
    var directions = ['North', 'North-Easy', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
}