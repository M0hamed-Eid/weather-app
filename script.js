const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const getWeatherBtn = document.getElementById("getWeather");
const weatherInfo = document.getElementById("weatherInfo");

const weatherApiKey = "3bd88233d6755313fb864e3285d7da24";
const geoNamesUsername = "stokgo"; 

// Fetch country list dynamically
async function fetchCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        countrySelect.innerHTML = '<option value="">Select Country</option>';

        countries.forEach(country => {
            if (country.cca2) { // Using Alpha-2 country code
                const option = document.createElement("option");
                option.value = country.cca2; // Store country code instead of full name
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching countries:", error);
        countrySelect.innerHTML = '<option value="">Failed to load countries</option>';
    }
}

// Fetch cities from GeoNames API
async function fetchCities(countryCode) {
    try {
        const response = await fetch(
            `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=10&username=${geoNamesUsername}`
        );

        const data = await response.json();

        if (data.geonames && data.geonames.length > 0) {
            citySelect.innerHTML = '<option value="">Select City</option>';
            data.geonames.forEach(city => {
                const option = document.createElement("option");
                option.value = city.name;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        } else {
            citySelect.innerHTML = '<option value="">No cities found</option>';
            citySelect.disabled = true;
        }
    } catch (error) {
        console.error("Error fetching cities:", error);
        citySelect.innerHTML = '<option value="">Failed to load cities</option>';
    }
}

// Fetch weather data (remains unchanged)
async function fetchWeather(cityName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod === 200) {
            weatherInfo.innerHTML = `
                <h3>Weather in ${data.name}</h3>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
        } else {
            weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        weatherInfo.innerHTML = `<p>Failed to fetch weather data.</p>`;
    }
}

// Event Listeners
countrySelect.addEventListener("change", async function () {
    citySelect.innerHTML = '<option value="">Loading cities...</option>';
    citySelect.disabled = true;
    if (this.value) {
        await fetchCities(this.value);
    }
});

citySelect.addEventListener("change", function () {
    getWeatherBtn.disabled = !this.value;
});

getWeatherBtn.addEventListener("click", function () {
    fetchWeather(citySelect.value);
});

// Initial Load
fetchCountries();

// Function to set background based on time
function setBackgroundImage() {
    const hour = new Date().getHours(); // Get current hour (0 - 23)
    const body = document.body;
    
    if (hour >= 6 && hour < 18) {
        // Morning: 6 AM - 5:59 PM
        body.style.backgroundImage = "url('assets/morning.jpg')";
    } else {
        // Evening: 6 PM - 5:59 AM
        body.style.backgroundImage = "url('assets/evening.jpg')";
    }
}

// Call function when the page loads
window.onload = setBackgroundImage;
