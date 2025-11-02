// Admin Dashboard Functionality
class AdminDashboard {
    constructor() {
        this.isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
        this.checkAuth();
        this.init();
    }

    checkAuth() {
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('admin-dashboard');

        if (this.isAuthenticated) {
            if (loginScreen) loginScreen.style.display = 'none';
            if (dashboard) dashboard.classList.remove('hidden');
        } else {
            if (loginScreen) loginScreen.style.display = 'flex';
            if (dashboard) dashboard.classList.add('hidden');
        }
    }

    init() {
        if (!this.isAuthenticated) {
            this.setupLogin();
        } else {
            this.setupDashboard();
        }
    }

    setupLogin() {
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Pre-fill for demo (can be removed in production)
        setTimeout(() => {
            document.getElementById('admin-username')?.focus();
        }, 100);
    }

    handleLogin() {
        const username = document.getElementById('admin-username')?.value;
        const password = document.getElementById('admin-password')?.value;
        const loginError = document.getElementById('login-error');

        // Demo credentials
        if (username === 'admin' && password === 'epidemic@123') {
            this.isAuthenticated = true;
            localStorage.setItem('admin_authenticated', 'true');
            this.showToast('✅ Login successful!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            loginError.style.display = 'block';
            loginError.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    }

    setupDashboard() {
        this.renderAlerts();
        this.updateStats();
        this.setupEventListeners();
        this.setupFilters();
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        const createForm = document.getElementById('create-alert-form');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        if (createForm) {
            createForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createManualAlert();
            });
        }
    }

    handleLogout() {
        localStorage.removeItem('admin_authenticated');
        this.showToast('👋 Logged out successfully', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    createManualAlert() {
        const disease = document.getElementById('disease-name')?.value;
        const region = document.getElementById('region-name')?.value;
        const severity = document.getElementById('severity-select')?.value;
        const message = document.getElementById('alert-message')?.value;

        if (!disease || !region || !severity || !message) {
            this.showToast('❌ Please fill all fields', 'error');
            return;
        }

        // Calculate risk percentage based on severity
        const riskPercentages = { Low: 15, Moderate: 35, High: 65 };
        const riskPercentage = riskPercentages[severity] || 30;

        const alert = {
            id: 'manual_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            disease: disease,
            region: region,
            severity: severity,
            riskPercentage: riskPercentage,
            timestamp: new Date().toISOString(),
            message: message,
            type: 'manual'
        };

        // Add to global alert system if available
        if (window.alertSystem) {
            window.alertSystem.addAlert(alert);
        } else {
            // Store in localStorage
            const alerts = this.loadAlertsFromStorage();
            alerts.unshift(alert);
            localStorage.setItem('epidemic_alerts', JSON.stringify(alerts.slice(0, 50)));
        }

        this.showToast('🚨 Alert created successfully!', 'success');
        
        // Clear form
        document.getElementById('create-alert-form')?.reset();
        
        // Refresh display
        this.renderAlerts();
        this.updateStats();
        
        // Trigger notification if severity is high
        if (severity === 'High') {
            if (window.alertSystem) {
                window.alertSystem.playAlertSound();
            }
        }
    }

    renderAlerts() {
        const container = document.getElementById('admin-alerts-container');
        if (!container) return;

        let alerts = this.loadAlertsFromStorage();
        const severityFilter = document.getElementById('filter-severity')?.value;
        const regionFilter = document.getElementById('filter-region')?.value;

        // Apply filters
        if (severityFilter) {
            alerts = alerts.filter(a => a.severity === severityFilter);
        }
        if (regionFilter) {
            alerts = alerts.filter(a => a.region === regionFilter);
        }

        if (alerts.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <p style="color: var(--text-secondary);">No alerts found with current filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = alerts.map(alert => this.createAlertRow(alert)).join('');
        this.updateRegionFilter();
    }

    createAlertRow(alert) {
        const severityColors = {
            Low: { bg: '#10b981', icon: '🟢' },
            Moderate: { bg: '#f59e0b', icon: '🟡' },
            High: { bg: '#ef4444', icon: '🔴' }
        };

        const colors = severityColors[alert.severity] || severityColors.Moderate;
        const timeAgo = this.getTimeAgo(alert.timestamp);

        return `
            <div style="
                display: grid;
                grid-template-columns: auto 1fr auto auto auto;
                gap: 1rem;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
                transition: all 0.3s ease;
            " onmouseover="this.style.background='var(--bg-secondary)'"
               onmouseout="this.style.background='transparent'">
                <div style="
                    width: 40px;
                    height: 40px;
                    background: ${colors.bg};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                ">
                    ${colors.icon}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
                        ${alert.disease}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        ${alert.region}
                    </div>
                </div>
                <div style="
                    padding: 0.5rem 1rem;
                    background: ${colors.bg};
                    color: white;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.85rem;
                ">
                    ${alert.severity}
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem; white-space: nowrap;">
                    ${alert.riskPercentage.toFixed(1)}%
                </div>
                <div style="color: var(--text-secondary); font-size: 0.85rem; white-space: nowrap;">
                    ${timeAgo}
                </div>
            </div>
        `;
    }

    setupFilters() {
        const severityFilter = document.getElementById('filter-severity');
        const regionFilter = document.getElementById('filter-region');

        if (severityFilter) {
            severityFilter.addEventListener('change', () => this.renderAlerts());
        }

        if (regionFilter) {
            regionFilter.addEventListener('change', () => this.renderAlerts());
        }
    }

    updateRegionFilter() {
        const alerts = this.loadAlertsFromStorage();
        const uniqueRegions = [...new Set(alerts.map(a => a.region))].sort();
        const regionFilter = document.getElementById('filter-region');
        
        if (regionFilter && uniqueRegions.length > 0) {
            const currentValue = regionFilter.value;
            regionFilter.innerHTML = '<option value="">All Regions</option>';
            uniqueRegions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                if (region === currentValue) option.selected = true;
                regionFilter.appendChild(option);
            });
        }
    }

    updateStats() {
        const alerts = this.loadAlertsFromStorage();
        
        const totalAlerts = alerts.length;
        const highRisk = alerts.filter(a => a.severity === 'High').length;
        const moderateRisk = alerts.filter(a => a.severity === 'Moderate').length;
        const lowRisk = alerts.filter(a => a.severity === 'Low').length;

        document.getElementById('total-alerts-stat').textContent = totalAlerts;
        document.getElementById('high-risk-stat').textContent = highRisk;
        document.getElementById('moderate-risk-stat').textContent = moderateRisk;
        document.getElementById('low-risk-stat').textContent = lowRisk;
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

    loadAlertsFromStorage() {
        try {
            const stored = localStorage.getItem('epidemic_alerts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading alerts:', error);
            return [];
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Add additional styles
const style = document.createElement('style');
style.textContent = `
    .login-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }

    .login-card {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        padding: 3rem;
        border-radius: 25px;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-xl);
        width: 100%;
        max-width: 400px;
    }

    .login-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .login-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .login-header p {
        color: var(--text-secondary);
    }

    .toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    }

    .toast.hidden {
        display: none;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

