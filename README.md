# AI-Based Epidemic Prediction and Risk Analysis System

A modern web application that leverages artificial intelligence and real-time environmental data to predict epidemic risks and analyze public health conditions.

## 🌟 Features

- **Real-Time Data Integration**: Connects to Open-Meteo, OpenAQ, and IPAPI for live environmental data
- **AI-Powered Risk Assessment**: Analyzes multiple factors to calculate epidemic risk scores
- **3D Interactive Homepage**: Immersive Three.js globe visualization with mouse interactivity
- **Real-Time Alert System**: Continuous monitoring with 30-second updates and severity-based notifications
- **Admin Dashboard**: Secure login, manual alert creation, and comprehensive analytics
- **Bilingual Support**: Displays results in both English and Hindi
- **Interactive Visualizations**: Beautiful charts using Chart.js
- **Dark/Light Mode**: Modern UI with theme toggle functionality
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Glassmorphism Design**: Modern 2025 aesthetic with smooth animations and transitions

## 📁 Project Structure

```
AI-Epidemic-Prediction/
│
├── index.html          # 3D Homepage with globe visualization
├── prediction.html     # Risk prediction module
├── alerts.html        # Real-time alert monitoring
├── admin.html         # Admin dashboard (login required)
├── docs.html          # Comprehensive documentation
├── style.css          # Global styles with theme support
├── script.js          # Core JavaScript functionality
├── alerts-system.js   # Alert monitoring system
├── admin-dashboard.js # Admin dashboard logic
├── globe-3d.js        # Three.js 3D globe rendering
├── assets/            # Assets folder
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API access

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Open `index.html` in your web browser

No build process or dependencies required!

## 📖 Usage

### Homepage

- View project overview and features
- Click "Get Started" to navigate to the prediction module
- Click "Learn More" to view documentation

### Prediction Module

- Automatically detects your location using IP-based geolocation
- Fetches real-time weather and air quality data
- Calculates epidemic risk score based on environmental factors
- Displays bilingual results (English and Hindi)
- Shows interactive Chart.js visualization of risk factors

### Real-Time Alerts

- Live monitoring of global epidemic risks
- Automatic detection based on case increase rates (>15%) or death rates (>2%)
- Three severity levels: Low, Moderate, High
- Sound notifications for high-risk alerts
- Persistent storage using localStorage
- Color-coded cards with smooth animations

### Admin Dashboard

- Secure login (username: admin, password: epidemic@123)
- Statistics overview with severity distribution
- Manual alert creation interface
- Filter alerts by severity and region
- Real-time updates across all pages

### Documentation

- Comprehensive project overview
- Detailed methodology
- Technology stack information
- API documentation
- Alert system explanation
- Admin dashboard guide
- Future scope and enhancements

## 🔌 APIs Used

### Open-Meteo API
- **Purpose**: Weather forecasting data
- **Data**: Temperature, humidity, wind speed, cloud cover
- **Endpoint**: https://api.open-meteo.com/v1/forecast
- **Free Tier**: Yes, no API key required

### OpenAQ API
- **Purpose**: Air quality monitoring
- **Data**: PM2.5, PM10, Air Quality Index
- **Endpoint**: https://api.openaq.org/v2/locations
- **Free Tier**: Yes, generous rate limits

### IPAPI
- **Purpose**: IP-based geolocation
- **Data**: Latitude, longitude, city, country
- **Endpoint**: https://ipapi.co/json/
- **Free Tier**: Yes, 30,000 requests/month

### disease.sh API
- **Purpose**: Real-time COVID-19 statistics
- **Data**: Cases, deaths, active, recovered
- **Endpoint**: https://disease.sh/v3/covid-19/countries
- **Free Tier**: Yes, no API key required

## 🎨 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and glassmorphism
- **JavaScript ES6+**: Interactive functionality
- **Three.js**: 3D graphics and globe visualization
- **Chart.js**: Data visualization library
- **Google Fonts**: Inter and Noto Sans Devanagari

## 🔧 Features Explained

### Risk Assessment Algorithm

The system calculates epidemic risk based on:

1. **Temperature** (20% weight): Moderate temperatures (20-30°C) are ideal for pathogen survival
2. **Humidity** (15% weight): Moderate to high humidity (50-80%) facilitates transmission
3. **Air Quality** (25% weight): Poor air quality increases susceptibility to respiratory illnesses
4. **Cloud Cover** (15% weight): High cloud cover indicates stable atmospheric conditions
5. **Wind Speed** (25% weight): Low wind speed allows pathogens to remain in the air longer

**Risk Levels:**
- **Low** (0-30): Minimal risk, maintain routine protocols
- **Moderate** (30-50): Some risk factors present, enhanced monitoring
- **High** (50-75): Significant risk, implement preventive measures
- **Critical** (75-100): Immediate public health action required

## 🎯 Project Objectives

### Primary Objectives
- Develop an intuitive web interface for epidemic risk assessment
- Integrate real-time environmental data from multiple APIs
- Implement AI-powered risk analysis algorithms
- Provide bilingual output for broader accessibility
- Create visual data representations for better comprehension

### Secondary Objectives
- Design a modern, responsive interface with dark/light mode
- Ensure accessibility across different devices
- Demonstrate practical AI application in public health
- Create a deployable, production-ready system

## 📊 Future Enhancements

### Already Implemented ✨
- ✅ Real-time alert monitoring system
- ✅ Admin dashboard with secure authentication
- ✅ 3D interactive homepage with Three.js globe
- ✅ localStorage-based persistence
- ✅ Severity-based alert categorization
- ✅ Sound notifications for high-risk alerts
- ✅ Comprehensive documentation
- ✅ Dark/Light mode with smooth transitions
- ✅ Responsive design for all devices

### Short-term
- Integration of machine learning models
- Historical data analysis and trend prediction
- Additional language support
- User account system
- Email alerts for high-risk areas

### Long-term
- Mobile application development
- Health department database integration
- Real-time collaboration features
- Regional customization
- Disease-specific predictions (flu, dengue, malaria)

## 📝 Documentation

For detailed documentation, visit the `docs.html` page in the application or refer to the inline comments in the source code.

## 🤝 Contributing

This is a capstone project submission. For questions or suggestions, please refer to the documentation section.

## 📄 License

This project is part of a college capstone submission. All rights reserved.

## 👨‍💻 Developer Notes

- All text is designed to be fully visible in both light and dark modes
- The application uses CSS custom properties for easy theme management
- API fallback mechanisms ensure graceful degradation
- Bilingual output supports both English and Hindi languages
- Chart.js visualizations are responsive and accessible

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚠️ Important Notes

- The application requires an active internet connection
- Some APIs may have rate limits on free tiers
- Location detection works best with accurate IP geolocation
- Air quality data may not be available for all locations

---

**Built with ❤️ for public health research**

*Last Updated: 2025*

