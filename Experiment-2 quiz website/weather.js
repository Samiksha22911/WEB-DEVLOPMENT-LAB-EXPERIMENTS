/* =========================
   WEATHER VARIABLES
========================= */

let userLatitude = null;
let userLongitude = null;


/* =========================
   GET USER LOCATION
========================= */

function getUserLocation() {

    const homeWeather =
        document.getElementById("homeWeather");

    const quizWeather =
        document.getElementById("quizWeather");


    if (!navigator.geolocation) {

        showLocationError(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    if (homeWeather) {

        homeWeather.innerHTML =
            "Detecting your location...";
    }


    if (quizWeather) {

        quizWeather.innerHTML =
            "Detecting your location...";
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            userLatitude =
                position.coords.latitude;

            userLongitude =
                position.coords.longitude;


            getWeatherByLocation();

        },

        function(error) {

            console.error(error);


            showLocationError(
                "Location permission was denied. Please allow location access to see automatic weather."
            );

        },

        {
            enableHighAccuracy: false,

            timeout: 10000,

            maximumAge: 300000
        }

    );

}



/* =========================
   GET WEATHER USING
   LATITUDE + LONGITUDE
========================= */

async function getWeatherByLocation() {

    if (
        userLatitude === null ||
        userLongitude === null
    ) {

        return;
    }


    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${userLatitude}&longitude=${userLongitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;


    try {

        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather."
            );

        }


        const data =
            await response.json();


        const current =
            data.current;


        const units =
            data.current_units;


        const condition =
            getWeatherDescription(
                current.weather_code
            );


        const weatherHTML = `

            <div class="automatic-weather">

                <h3>
                    📍 Your Current Location
                </h3>

                <p>
                    <strong>
                        Temperature:
                    </strong>

                    ${current.temperature_2m}
                    ${units.temperature_2m}
                </p>

                <p>
                    <strong>
                        Feels Like:
                    </strong>

                    ${current.apparent_temperature}
                    ${units.apparent_temperature}
                </p>

                <p>
                    <strong>
                        Condition:
                    </strong>

                    ${condition}
                </p>

                <p>
                    <strong>
                        Humidity:
                    </strong>

                    ${current.relative_humidity_2m}%
                </p>

                <p>
                    <strong>
                        Wind:
                    </strong>

                    ${current.wind_speed_10m}
                    ${units.wind_speed_10m}
                </p>

                <p class="weather-updated">
                    Updated automatically
                </p>

            </div>

        `;


        const homeWeather =
            document.getElementById(
                "homeWeather"
            );


        const quizWeather =
            document.getElementById(
                "quizWeather"
            );


        if (homeWeather) {

            homeWeather.innerHTML =
                weatherHTML;

        }


        if (quizWeather) {

            quizWeather.innerHTML =
                weatherHTML;

        }


    } catch (error) {

        console.error(error);


        showLocationError(
            "Unable to load weather. Please try again."
        );

    }

}



/* =========================
   REFRESH WEATHER
========================= */

function refreshWeather() {

    if (
        userLatitude === null ||
        userLongitude === null
    ) {

        getUserLocation();

        return;
    }


    getWeatherByLocation();

}



/* =========================
   LOCATION ERROR
========================= */

function showLocationError(message) {

    const homeWeather =
        document.getElementById(
            "homeWeather"
        );


    const quizWeather =
        document.getElementById(
            "quizWeather"
        );


    const errorHTML = `

        <div>

            <p>
                ${message}
            </p>

            <button
                onclick="getUserLocation()"
                class="small-btn"
            >
                Allow Location / Try Again
            </button>

        </div>

    `;


    if (homeWeather) {

        homeWeather.innerHTML =
            errorHTML;

    }


    if (quizWeather) {

        quizWeather.innerHTML =
            errorHTML;

    }

}



/* =========================
   WEATHER DESCRIPTION
========================= */

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Depositing rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Dense drizzle",

        61: "Slight rain",

        63: "Moderate rain",

        65: "Heavy rain",

        71: "Slight snow",

        73: "Moderate snow",

        75: "Heavy snow",

        80: "Slight rain showers",

        81: "Moderate rain showers",

        82: "Violent rain showers",

        95: "Thunderstorm",

        96: "Thunderstorm with hail",

        99: "Thunderstorm with heavy hail"

    };


    return (
        weatherCodes[code] ||
        "Unknown weather"
    );

}



/* =========================
   AUTOMATIC WEATHER LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        getUserLocation();

    }
);


/* =========================
   AUTO REFRESH
   EVERY 10 MINUTES
========================= */

setInterval(
    function() {

        if (
            userLatitude !== null &&
            userLongitude !== null
        ) {

            getWeatherByLocation();

        }

    },
    10 * 60 * 1000
);