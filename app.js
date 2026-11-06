const API_KEY = '4b3618efe6b2ac0ebb16b33d8b6f73ff'; // Reemplazar con una clave válida de OpenWeatherMap
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Cargar historial al iniciar la aplicación
document.addEventListener('DOMContentLoaded', renderHistory);

// Evento Submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        cityInput.value = '';
    }
});

// Función asincrónica para consumir la Fetch API
async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ciudad no encontrada o error en la red.');
        
        const data = await response.json();
        displayWeather(data);
        saveToHistory(data.name);
    } catch (error) {
        alert(error.message);
    }
}

// Renderizar datos en el DOM
function displayWeather(data) {
    weatherResult.classList.remove('hidden');
    weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p style="font-size: 2.5rem; font-weight: bold; margin: 0.5rem 0;">${Math.round(data.main.temp)}°C</p>
        <p style="text-transform: capitalize;">${data.weather[0].description}</p>
        <div style="display: flex; justify-content: space-around; margin-top: 1rem; font-size: 0.9rem;">
            <span>Humedad: ${data.main.humidity}%</span>
            <span>Viento: ${data.wind.speed} m/s</span>
        </div>
    `;
}

// Gestión del LocalStorage y JSON
function saveToHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('weather_history')) || [];
    
    // Evitar duplicados y mantener máximo 5 elementos
    history = history.filter(item => item.toLowerCase() !== cityName.toLowerCase());
    history.unshift(cityName);
    if (history.length > 5) history.pop();

    localStorage.setItem('weather_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weather_history')) || [];
    historyList.innerHTML = '';

    if (history.length > 0) {
        clearHistoryBtn.classList.remove('hidden');
        history.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => fetchWeatherData(city));
            historyList.appendChild(li);
        });
    } else {
        clearHistoryBtn.classList.add('hidden');
    }
}

// Limpiar historial
clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('weather_history');
    renderHistory();
    weatherResult.classList.add('hidden');
});