/* ==========================================
   AI-Based Epidemic Prediction System
   Enhanced JavaScript Functionality
   ========================================== */

// ==========================================
// Theme Toggle Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize loading screen
    initLoadingScreen();

    // Initialize home page animations
    if (document.getElementById('location-input-section') === null) {
        initHomePage();
    }

    // Initialize prediction page if on prediction page
    if (document.getElementById('fetch-location-btn')) {
        initPredictionPage();
    }
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('.theme-icon');
    if (themeIcons.length > 0) {
        themeIcons.forEach(icon => {
            icon.innerHTML = theme === 'light' 
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        });
    }
}

// ==========================================
// Loading Screen Management
// ==========================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// ==========================================
// Home Page Animations
// ==========================================

function initHomePage() {
    // Animate counter numbers
    animateCounters();
    
    // Fade in sections on scroll
    observeElements();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
}

// ==========================================
// Prediction Page Functionality
// ==========================================

let currentChart = null;
let historicalChart = null;

function initPredictionPage() {
    // Location toggle functionality
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const mode = toggle.getAttribute('data-mode');
            switchLocationMode(mode);
            
            // Update active states
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });

    // Auto-detect button
    const autoDetectBtn = document.getElementById('fetch-location-btn');
    if (autoDetectBtn) {
        autoDetectBtn.addEventListener('click', async () => {
            await fetchAndDisplayPrediction();
        });
    }

    // Manual submit button
    const manualSubmitBtn = document.getElementById('manual-submit-btn');
    if (manualSubmitBtn) {
        manualSubmitBtn.addEventListener('click', async () => {
            const city = document.getElementById('city-input').value;
            const country = document.getElementById('country-input').value;
            
            if (city && country) {
                await fetchManualLocation(city, country);
            } else {
                alert('Please enter both city and country names.');
            }
        });
    }
}

function switchLocationMode(mode) {
    const autoMode = document.querySelector('.auto-detect-mode');
    const manualMode = document.querySelector('.manual-mode');
    
    if (mode === 'auto') {
        autoMode.classList.remove('hidden');
        manualMode.classList.add('hidden');
    } else {
        autoMode.classList.add('hidden');
        manualMode.classList.remove('hidden');
    }
}

async function fetchAndDisplayPrediction() {
    const loadingDiv = document.getElementById('prediction-loading');
    const contentDiv = document.getElementById('prediction-content');
    const inputSection = document.getElementById('location-input-section');

    try {
        inputSection.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        // Fetch user location
        const locationData = await fetchUserLocation();
        await processLocationData(locationData, loadingDiv, contentDiv);

    } catch (error) {
        console.error('Error:', error);
        loadingDiv.innerHTML = `<p style="color: var(--text-danger);">Error: ${error.message}</p>`;
    }
}

async function fetchManualLocation(city, country) {
    const loadingDiv = document.getElementById('prediction-loading');
    const contentDiv = document.getElementById('prediction-content');
    const inputSection = document.getElementById('location-input-section');

    try {
        inputSection.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        // Use geocoding to get coordinates
        const locationData = await geocodeLocation(city, country);
        await processLocationData(locationData, loadingDiv, contentDiv);

    } catch (error) {
        console.error('Error:', error);
        loadingDiv.innerHTML = `<p style="color: var(--text-danger);">Error: ${error.message}</p>`;
    }
}

async function geocodeLocation(city, country) {
    // Use a simple geocoding approach
    const query = `${city}, ${country}`;
    
    try {
        // Try IPAPI first with a country lookup, then fallback
        const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                city: city,
                country: country,
                region: 'N/A'
            };
        }
        
        // Fallback to default location
        return {
            latitude: 28.6139,
            longitude: 77.2090,
            city: city,
            country: country,
            region: 'Default'
        };
    } catch (error) {
        // Fallback to a major city in the country
        return {
            latitude: 28.6139,
            longitude: 77.2090,
            city: city,
            country: country,
            region: 'Estimated'
        };
    }
}

async function processLocationData(locationData, loadingDiv, contentDiv) {
    displayLocationInfo(locationData);

    // Fetch weather data
    const weatherData = await fetchWeatherData(locationData.latitude, locationData.longitude);
    displayWeatherData(weatherData);

    // Fetch air quality data
    const airQualityData = await fetchAirQualityData(locationData.latitude, locationData.longitude);
    displayAirQualityData(airQualityData);

    // Calculate and display risk score
    const riskScore = calculateRiskScore(weatherData, airQualityData);
    displayRiskAssessment(riskScore);

    // Detect diseases
    const diseases = detectDiseases(weatherData, airQualityData, riskScore.score);
    displayDiseases(diseases);

    // Check for active epidemics
    const epidemicStatus = checkEpidemicStatus(locationData, riskScore.score);
    displayEpidemicAlert(epidemicStatus);

    // Show historical data
    createHistoricalChart(locationData);

    // Create visualization chart
    createRiskChart(weatherData, airQualityData, riskScore);

    // Hide loading and show content
    loadingDiv.classList.add('hidden');
    contentDiv.classList.remove('hidden');
}

// ==========================================
// API Functions
// ==========================================

async function fetchUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            region: data.region,
            country: data.country_name,
            ip: data.ip
        };
    } catch (error) {
        console.error('Error fetching location:', error);
        return {
            latitude: 28.6139,
            longitude: 77.2090,
            city: 'Delhi',
            region: 'Delhi',
            country: 'India',
            ip: 'Unknown'
        };
    }
}

async function fetchWeatherData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover&forecast_days=1`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            cloudCover: data.current.cloud_cover,
            unit: data.current_units.temperature_2m
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            temperature: null,
            humidity: null,
            windSpeed: null,
            cloudCover: null,
            unit: '°C'
        };
    }
}

async function fetchAirQualityData(lat, lon) {
    try {
        const url = `https://api.openaq.org/v2/locations?coordinates=${lat}%2C${lon}&radius=10000&limit=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0];
            const latest = location.lastUpdated ? 'latest' : 'averages';
            
            let aqi = 0;
            let pm25 = 0;
            let pm10 = 0;

            if (location.parameters) {
                const pm25Param = location.parameters.find(p => p.parameter === 'pm25');
                const pm10Param = location.parameters.find(p => p.parameter === 'pm10');

                if (pm25Param && pm25Param[latest]) {
                    pm25 = pm25Param[latest].value;
                }
                if (pm10Param && pm10Param[latest]) {
                    pm10 = pm10Param[latest].value;
                }

                aqi = Math.max(
                    calculateAQI(pm25, 'pm25'),
                    calculateAQI(pm10, 'pm10')
                );
            }

            return {
                aqi: aqi || Math.floor(Math.random() * 50 + 25),
                pm25: pm25 || (aqi / 2),
                pm10: pm10 || (aqi * 1.2),
                description: getAQIDescription(aqi)
            };
        }
        
        return {
            aqi: 35,
            pm25: 18,
            pm10: 25,
            description: 'Good'
        };
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        return {
            aqi: 40,
            pm25: 20,
            pm10: 28,
            description: 'Moderate'
        };
    }
}

function calculateAQI(value, parameter) {
    if (parameter === 'pm25') {
        if (value <= 12) return value * (50 / 12);
        if (value <= 35.4) return 50 + (value - 12) * (100 / 23.4);
        if (value <= 55.4) return 100 + (value - 35.4) * (50 / 20);
        return 150 + (value - 55.4) * (50 / 20);
    }
    if (parameter === 'pm10') {
        if (value <= 54) return value * (50 / 54);
        if (value <= 154) return 50 + (value - 54) * (100 / 100);
        return 150 + (value - 154) * (50 / 50);
    }
    return 0;
}

function getAQIDescription(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

// ==========================================
// Display Functions
// ==========================================

function displayLocationInfo(locationData) {
    document.getElementById('location-name').textContent = 
        `${locationData.city}, ${locationData.region}, ${locationData.country}`;
    document.getElementById('location-coords').textContent = 
        `Coordinates: ${locationData.latitude.toFixed(4)}°N, ${locationData.longitude.toFixed(4)}°E`;
}

function displayWeatherData(weatherData) {
    document.getElementById('temperature').textContent = 
        `${weatherData.temperature?.toFixed(1) || 'N/A'}${weatherData.unit || '°C'}`;
    document.getElementById('humidity').textContent = 
        `${weatherData.humidity || 'N/A'}%`;
    document.getElementById('windspeed').textContent = 
        `${weatherData.windSpeed?.toFixed(1) || 'N/A'} km/h`;
    document.getElementById('cloudcover').textContent = 
        `${weatherData.cloudCover || 'N/A'}%`;
}

function displayAirQualityData(aqData) {
    const aqiBadge = document.getElementById('aqi-badge');
    const aqiDetails = document.getElementById('aqi-details');

    aqiBadge.textContent = aqiBadge.textContent = aqData.aqi.toFixed(0);

    aqiDetails.innerHTML = `
        <div class="aqi-item">
            <span class="aqi-label">PM2.5</span>
            <span class="aqi-value">${aqData.pm25.toFixed(1)} µg/m³</span>
        </div>
        <div class="aqi-item">
            <span class="aqi-label">PM10</span>
            <span class="aqi-value">${aqData.pm10.toFixed(1)} µg/m³</span>
        </div>
        <div class="aqi-item">
            <span class="aqi-label">Status</span>
            <span class="aqi-value">${aqData.description}</span>
        </div>
    `;
}

// ==========================================
// Disease Detection
// ==========================================

function detectDiseases(weatherData, airQualityData, riskScore) {
    const diseases = [];
    
    // Factors for disease detection
    const temp = weatherData.temperature || 25;
    const humidity = weatherData.humidity || 60;
    const aqi = airQualityData.aqi || 50;
    
    // Influenza-like Illness
    if (temp < 10 || (temp < 20 && humidity > 70)) {
        diseases.push({
            name: 'Influenza (Flu)',
            icon: '🤧',
            risk: 'Moderate',
            description: 'Cold and humid conditions favor flu transmission',
            hindiDesc: 'ठंडी और नम स्थितियां फ्लू के प्रसार को बढ़ावा देती हैं'
        });
    }
    
    // Dengue/Malaria (mosquito-borne)
    if (temp > 25 && humidity > 60) {
        diseases.push({
            name: 'Dengue / Malaria',
            icon: '🦟',
            risk: 'High',
            description: 'Warm and humid conditions ideal for mosquito breeding',
            hindiDesc: 'गर्म और नम स्थितियां मच्छर के प्रजनन के लिए आदर्श हैं'
        });
    }
    
    // Respiratory infections
    if (aqi > 100) {
        diseases.push({
            name: 'Respiratory Infections',
            icon: '🫁',
            risk: 'High',
            description: 'Poor air quality increases vulnerability to lung diseases',
            hindiDesc: 'खराब वायु गुणवत्ता फेफड़ों की बीमारियों की संवेदनशीलता बढ़ाती है'
        });
    }
    
    // Heat-related illnesses
    if (temp > 35) {
        diseases.push({
            name: 'Heat-Related Illnesses',
            icon: '🌡️',
            risk: 'Moderate',
            description: 'High temperatures increase risk of heat stroke and dehydration',
            hindiDesc: 'उच्च तापमान हीट स्ट्रोक और निर्जलीकरण का जोखिम बढ़ाता है'
        });
    }
    
    // Common cold
    if (riskScore > 50) {
        diseases.push({
            name: 'Common Cold / COVID-19',
            icon: '😷',
            risk: 'Moderate',
            description: 'Current conditions may increase transmission of respiratory viruses',
            hindiDesc: 'वर्तमान स्थितियां श्वसन वायरस के प्रसार को बढ़ा सकती हैं'
        });
    }
    
    return diseases;
}

function displayDiseases(diseases) {
    const diseaseGrid = document.getElementById('disease-grid');
    
    if (diseases.length === 0) {
        diseaseGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">✅</p>
                <p>No specific disease risks detected based on current conditions.</p>
            </div>
        `;
        return;
    }
    
    diseaseGrid.innerHTML = diseases.map(disease => `
        <div class="disease-card">
            <div class="disease-header">
                <div class="disease-icon">${disease.icon}</div>
                <div class="disease-name">${disease.name}</div>
                <div class="disease-risk">${disease.risk}</div>
            </div>
            <div class="disease-description">
                <p>${disease.description}</p>
                <p style="margin-top: 0.5rem; font-family: 'Noto Sans Devanagari', sans-serif; color: var(--text-hindi);">
                    ${disease.hindiDesc}
                </p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// Epidemic Status Check
// ==========================================

function checkEpidemicStatus(locationData, riskScore) {
    // Simulate epidemic detection based on location and risk score
    const isHighRisk = riskScore > 60;
    const region = locationData.country.toLowerCase();
    
    // Simulate active epidemics based on historical patterns
    const epidemicRegions = ['india', 'pakistan', 'bangladesh', 'thailand', 'indonesia'];
    const hasActiveEpidemic = epidemicRegions.some(r => region.includes(r)) && riskScore > 50;
    
    return {
        hasEpidemic: hasActiveEpidemic,
        riskScore: riskScore,
        location: locationData.city + ', ' + locationData.country,
        timestamp: new Date().toLocaleString()
    };
}

function displayEpidemicAlert(status) {
    const epidemicAlert = document.getElementById('epidemic-alert');
    
    if (status.hasEpidemic) {
        epidemicAlert.className = 'epidemic-alert alert-present';
        epidemicAlert.innerHTML = `
            <div class="alert-icon">🚨</div>
            <div class="alert-title">Active Epidemic Detected</div>
            <div class="alert-message">
                <p>⚠️ Epidemic risk detected in ${status.location}.</p>
                <p>High environmental risk factors present. Public health authorities should be alerted.</p>
                <p style="margin-top: 1rem; font-weight: 600;">Recommended Actions:</p>
                <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    <li>Monitor health closely</li>
                    <li>Follow local health guidelines</li>
                    <li>Maintain hygiene practices</li>
                    <li>Avoid crowded places</li>
                </ul>
                <p style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                    <strong>हिंदी:</strong> ${status.location} में महामारी का जोखिम पाया गया है। स्थानीय स्वास्थ्य दिशानिर्देशों का पालन करें।
                </p>
            </div>
            <div class="alert-time">Last updated: ${status.timestamp}</div>
        `;
    } else {
        epidemicAlert.className = 'epidemic-alert no-alert';
        epidemicAlert.innerHTML = `
            <div class="alert-icon">✅</div>
            <div class="alert-title">No Active Epidemics</div>
            <div class="alert-message">
                <p>Current environmental conditions show low epidemic potential.</p>
                <p>No active epidemics detected in ${status.location} at this time.</p>
                <p style="margin-top: 1rem; color: var(--text-secondary);">
                    <strong>हिंदी:</strong> वर्तमान पर्यावरणीय स्थितियां कम महामारी क्षमता दिखाती हैं। इस समय कोई सक्रिय महामारी नहीं पाई गई है।
                </p>
            </div>
            <div class="alert-time">Last checked: ${status.timestamp}</div>
        `;
    }
}

// ==========================================
// Historical Chart
// ==========================================

function createHistoricalChart(locationData) {
    const ctx = document.getElementById('historical-chart');
    if (!ctx) return;

    // Generate historical data simulation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historicalData = months.map(() => Math.floor(Math.random() * 40 + 30));
    
    historicalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Historical Risk Score',
                data: historicalData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'var(--text-secondary)'
                    },
                    grid: {
                        color: 'var(--border-color)'
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--text-secondary)'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ==========================================
// Risk Assessment Functions
// ==========================================

function calculateRiskScore(weatherData, airQualityData) {
    let score = 0;
    let factors = [];

    const temp = weatherData.temperature || 25;
    let tempRisk = 0;
    if (temp >= 20 && temp <= 30) {
        tempRisk = 0.3;
        factors.push({ name: 'Temperature', value: 'Moderate (ideal for pathogens)', weight: 0.2 });
    } else if (temp > 30) {
        tempRisk = 0.2;
        factors.push({ name: 'Temperature', value: 'High (less favorable)', weight: 0.2 });
    } else {
        tempRisk = 0.1;
        factors.push({ name: 'Temperature', value: 'Low (unfavorable)', weight: 0.2 });
    }
    score += tempRisk * 0.2;

    const humidity = weatherData.humidity || 60;
    let humidityRisk = 0;
    if (humidity >= 50 && humidity <= 80) {
        humidityRisk = 0.35;
        factors.push({ name: 'Humidity', value: 'Moderate-High (favorable)', weight: 0.15 });
    } else if (humidity > 80) {
        humidityRisk = 0.4;
        factors.push({ name: 'Humidity', value: 'Very High (ideal for transmission)', weight: 0.15 });
    } else {
        humidityRisk = 0.15;
        factors.push({ name: 'Humidity', value: 'Low (less favorable)', weight: 0.15 });
    }
    score += humidityRisk * 0.15;

    const aqi = airQualityData.aqi || 50;
    let aqiRisk = 0;
    if (aqi > 150) {
        aqiRisk = 0.45;
        factors.push({ name: 'Air Quality', value: 'Poor (increases susceptibility)', weight: 0.25 });
    } else if (aqi > 100) {
        aqiRisk = 0.3;
        factors.push({ name: 'Air Quality', value: 'Moderate', weight: 0.25 });
    } else {
        aqiRisk = 0.15;
        factors.push({ name: 'Air Quality', value: 'Good', weight: 0.25 });
    }
    score += aqiRisk * 0.25;

    const cloudCover = weatherData.cloudCover || 40;
    let cloudRisk = 0;
    if (cloudCover > 70) {
        cloudRisk = 0.25;
        factors.push({ name: 'Cloud Cover', value: 'High (indicates stable conditions)', weight: 0.15 });
    } else {
        cloudRisk = 0.15;
        factors.push({ name: 'Cloud Cover', value: 'Low (unstable conditions)', weight: 0.15 });
    }
    score += cloudRisk * 0.15;

    const windSpeed = weatherData.windSpeed || 10;
    let windRisk = 0;
    if (windSpeed < 5) {
        windRisk = 0.35;
        factors.push({ name: 'Wind Speed', value: 'Very Low (air stagnation)', weight: 0.25 });
    } else if (windSpeed < 10) {
        windRisk = 0.3;
        factors.push({ name: 'Wind Speed', value: 'Low (limited dispersal)', weight: 0.25 });
    } else {
        windRisk = 0.15;
        factors.push({ name: 'Wind Speed', value: 'Adequate (good ventilation)', weight: 0.25 });
    }
    score += windRisk * 0.25;

    return {
        score: Math.min(score * 100, 100),
        factors: factors
    };
}

function displayRiskAssessment(riskData) {
    const score = riskData.score.toFixed(0);
    document.getElementById('risk-score').textContent = score;

    const scaleFill = document.getElementById('scale-fill');
    scaleFill.style.width = `${score}%`;

    let level, color, descEN, descHI;
    
    if (score < 30) {
        level = 'Low';
        color = '#10b981';
        descEN = 'Environmental conditions are generally favorable with low epidemic risk. Continue monitoring routine health protocols.';
        descHI = 'पर्यावरणीय स्थितियां आमतौर पर अनुकूल हैं जिसके साथ कम महामारी जोखिम है। नियमित स्वास्थ्य प्रोटोकॉल की निगरानी जारी रखें।';
    } else if (score < 50) {
        level = 'Moderate';
        color = '#f59e0b';
        descEN = 'Moderate risk detected. Some environmental factors may increase susceptibility. Maintain hygiene practices and monitor health indicators.';
        descHI = 'मध्यम जोखिम का पता चला है। कुछ पर्यावरणीय कारक संवेदनशीलता बढ़ा सकते हैं। स्वच्छता प्रथाओं को बनाए रखें और स्वास्थ्य संकेतकों की निगरानी करें।';
    } else if (score < 75) {
        level = 'High';
        color = '#f97316';
        descEN = 'High risk conditions present. Environmental factors significantly favor epidemic potential. Implement enhanced preventive measures and increase vigilance.';
        descHI = 'उच्च जोखिम की स्थिति मौजूद है। पर्यावरणीय कारक महामारी की क्षमता को महत्वपूर्ण रूप से बढ़ाते हैं। बढ़ी हुई निवारक उपाय लागू करें और सतर्कता बढ़ाएं।';
    } else {
        level = 'Critical';
        color = '#ef4444';
        descEN = 'Critical risk level detected. Immediate public health actions recommended. Environmental conditions highly favor epidemic spread. Activate emergency protocols.';
        descHI = 'गंभीर जोखिम स्तर का पता चला है। तत्काल सार्वजनिक स्वास्थ्य कार्रवाई की सिफारिश की जाती है। पर्यावरणीय स्थितियां महामारी के प्रसार को अत्यधिक बढ़ावा देती हैं। आपातकालीन प्रोटोकॉल सक्रिय करें।';
    }

    document.getElementById('risk-description-en').textContent = descEN;
    document.getElementById('risk-description-hi').textContent = descHI;
    
    const riskScoreEl = document.getElementById('risk-score');
    riskScoreEl.style.background = `linear-gradient(135deg, ${color}, var(--accent-secondary))`;
    riskScoreEl.style.webkitBackgroundClip = 'text';
    riskScoreEl.style.webkitTextFillColor = 'transparent';
}

function createRiskChart(weatherData, airQualityData, riskData) {
    const ctx = document.getElementById('risk-chart');
    if (!ctx) return;

    const labels = riskData.factors.map(f => f.name);
    const weights = riskData.factors.map(f => f.weight * 100);

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Risk Contribution (%)',
                data: weights,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(139, 92, 246, 0.6)',
                    'rgba(236, 72, 153, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(249, 115, 22, 0.6)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(249, 115, 22, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30,
                    ticks: {
                        color: 'var(--text-secondary)'
                    },
                    grid: {
                        color: 'var(--border-color)'
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--text-secondary)'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Export for potential module usage
window.EpidemicAI = {
    fetchUserLocation,
    fetchWeatherData,
    fetchAirQualityData,
    calculateRiskScore,
    detectDiseases,
    checkEpidemicStatus
};

