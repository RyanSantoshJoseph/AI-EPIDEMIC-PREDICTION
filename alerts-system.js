// Real-Time Alert System
class AlertSystem {
    constructor() {
        this.apiEndpoint = 'https://disease.sh/v3/covid-19/countries';
        this.updateInterval = 30000; // 30 seconds
        this.alerts = this.loadAlertsFromStorage();
        this.intervalId = null;
        this.audioContext = null;
        
        this.init();
    }

    init() {
        this.updateAlertBadge();
        this.renderAlerts();
        this.startMonitoring();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-btn');
        const clearBtn = document.getElementById('clear-alerts-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.fetchAndAnalyzeData(true));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllAlerts());
        }
    }

    startMonitoring() {
        // Initial fetch
        this.fetchAndAnalyzeData();
        
        // Set up interval
        this.intervalId = setInterval(() => {
            this.fetchAndAnalyzeData();
        }, this.updateInterval);
    }

    async fetchAndAnalyzeData(manualRefresh = false) {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) throw new Error('API request failed');
            
            const countries = await response.json();
            const alerts = this.analyzeData(countries);
            
            if (alerts.length > 0) {
                alerts.forEach(alert => this.addAlert(alert));
                if (alerts.some(a => a.severity === 'High')) {
                    this.playAlertSound();
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Use sample data for demonstration
            if (manualRefresh) {
                this.generateSampleAlerts();
            }
        }
    }

    analyzeData(countries) {
        const alerts = [];
        const sampleSize = Math.min(10, countries.length);
        const sampledCountries = countries.slice(0, sampleSize);

        sampledCountries.forEach(country => {
            const todayCases = country.todayCases || 0;
            const todayDeaths = country.todayDeaths || 0;
            const totalCases = country.cases || 0;
            const totalDeaths = country.deaths || 0;

            // Calculate increase rates
            const caseIncreaseRate = totalCases > 0 ? (todayCases / totalCases) * 100 : 0;
            const deathRate = totalCases > 0 ? (totalDeaths / totalCases) * 100 : 0;

            // Check if alert should be triggered
            if (caseIncreaseRate > 15 || deathRate > 2) {
                const severity = this.determineSeverity(caseIncreaseRate, deathRate);
                
                alerts.push({
                    id: this.generateAlertId(),
                    disease: 'COVID-19',
                    region: country.country,
                    severity: severity,
                    riskPercentage: Math.max(caseIncreaseRate, deathRate * 10),
                    timestamp: new Date().toISOString(),
                    message: this.generateAlertMessage(country, severity, caseIncreaseRate, deathRate),
                    type: 'auto'
                });
            }
        });

        return alerts;
    }

    determineSeverity(caseRate, deathRate) {
        if (caseRate > 25 || deathRate > 3) {
            return 'High';
        } else if (caseRate > 18 || deathRate > 2.5) {
            return 'Moderate';
        }
        return 'Low';
    }

    generateAlertMessage(country, severity, caseRate, deathRate) {
        const riskFactors = [];
        
        if (caseRate > 15) {
            riskFactors.push(`Case increase rate of ${caseRate.toFixed(1)}%`);
        }
        
        if (deathRate > 2) {
            riskFactors.push(`Death rate of ${deathRate.toFixed(2)}%`);
        }

        return `⚠️ ${country.country} showing concerning ${severity.toLowerCase()} risk indicators. ${riskFactors.join(' and ')}. Monitoring recommended.`;
    }

    generateSampleAlerts() {
        const sampleAlerts = [
            {
                id: this.generateAlertId(),
                disease: 'Dengue',
                region: 'Southeast Asia',
                severity: 'High',
                riskPercentage: 28,
                timestamp: new Date().toISOString(),
                message: '⚠️ High transmission rates detected in Southeast Asia. Warm humid conditions ideal for mosquito breeding.',
                type: 'manual'
            },
            {
                id: this.generateAlertId(),
                disease: 'Influenza',
                region: 'North America',
                severity: 'Moderate',
                riskPercentage: 18,
                timestamp: new Date().toISOString(),
                message: '⚠️ Moderate flu activity detected. Cold season conditions favor transmission.',
                type: 'manual'
            }
        ];

        sampleAlerts.forEach(alert => this.addAlert(alert));
    }

    addAlert(alert) {
        // Check if alert already exists (prevent duplicates)
        const exists = this.alerts.some(a => 
            a.disease === alert.disease && 
            a.region === alert.region &&
            Math.abs(new Date(a.timestamp) - new Date(alert.timestamp)) < 60000 // Within 1 minute
        );

        if (!exists) {
            this.alerts.unshift(alert); // Add to beginning
            this.alerts = this.alerts.slice(0, 50); // Keep only last 50 alerts
            this.saveAlertsToStorage();
            this.updateAlertBadge();
            this.renderAlerts();
        }
    }

    renderAlerts() {
        const container = document.getElementById('alerts-container');
        if (!container) return;

        if (this.alerts.length === 0) {
            container.innerHTML = `
                <div class="no-alerts-message" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">No Alerts Yet</h3>
                    <p style="color: var(--text-secondary);">Monitoring in progress... Alerts will appear here when detected.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.alerts.map(alert => this.createAlertCard(alert)).join('');
        
        // Add animations
        const cards = container.querySelectorAll('.alert-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    createAlertCard(alert) {
        const severityColors = {
            Low: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: '🟢' },
            Moderate: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: '🟡' },
            High: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: '🔴' }
        };

        const colors = severityColors[alert.severity] || severityColors.Moderate;
        const timeAgo = this.getTimeAgo(alert.timestamp);

        return `
            <div class="alert-card" style="
                background: ${colors.bg};
                border-left: 4px solid ${colors.border};
                animation: fadeInUp 0.5s ease forwards;
                opacity: 0;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.2rem;">${colors.icon}</span>
                            <h3 style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin: 0;">
                                ${alert.disease}
                            </h3>
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">
                            📍 ${alert.region}
                        </p>
                    </div>
                    <div style="
                        background: ${colors.border};
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        white-space: nowrap;
                        margin-left: 1rem;
                    ">
                        ${alert.severity}
                    </div>
                </div>
                
                <div style="
                    background: var(--bg-secondary);
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                ">
                    <p style="color: var(--text-primary); margin: 0; line-height: 1.6;">
                        ${alert.message}
                    </p>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">
                        Risk: ${alert.riskPercentage.toFixed(1)}%
                    </span>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">
                        ${timeAgo}
                    </span>
                </div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const then = new Date(timestamp);
        const diffInSeconds = Math.floor((now - then) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    clearAllAlerts() {
        if (confirm('Are you sure you want to clear all alerts?')) {
            this.alerts = [];
            this.saveAlertsToStorage();
            this.updateAlertBadge();
            this.renderAlerts();
        }
    }

    updateAlertBadge() {
        const badge = document.getElementById('alert-badge');
        if (badge) {
            badge.textContent = this.alerts.length;
            badge.style.display = this.alerts.length > 0 ? 'block' : 'none';
        }
    }

    playAlertSound() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Sound not available');
        }
    }

    generateAlertId() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadAlertsFromStorage() {
        try {
            const stored = localStorage.getItem('epidemic_alerts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading alerts:', error);
            return [];
        }
    }

    saveAlertsToStorage() {
        try {
            localStorage.setItem('epidemic_alerts', JSON.stringify(this.alerts));
        } catch (error) {
            console.error('Error saving alerts:', error);
        }
    }
}

// Initialize alert system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alertSystem = new AlertSystem();
});

// Add styles for alerts grid
const style = document.createElement('style');
style.textContent = `
    .alerts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    .alert-card {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        padding: 1.5rem;
        border-radius: 20px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
        animation: fadeInUp 0.5s ease forwards;
    }

    .alert-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-xl);
    }

    @media (max-width: 768px) {
        .alerts-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

