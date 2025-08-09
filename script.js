// Enhanced Authentication JavaScript with smooth transitions
class AuthManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setup3DBackground();
        this.setupMatrixEffect();
        this.setupCursorFollower();
        this.setupFloatingCodeAnimation();
    }

    init() {
        this.container = document.querySelector('.container');
        this.registerBtn = document.querySelector('.register-btn');
        this.loginBtn = document.querySelector('.login-btn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.currentForm = 'login';
    }

    setupEventListeners() {
        // Toggle between login and register with smooth animation
        this.registerBtn?.addEventListener('click', () => {
            this.container.classList.add('active');
            this.currentForm = 'register';
            this.animateFormSwitch('register');
            console.log('Switched to Register');
        });

        this.loginBtn?.addEventListener('click', () => {
            this.container.classList.remove('active');
            this.currentForm = 'login';
            this.animateFormSwitch('login');
            console.log('Switched to Login');
        });

        // Form submissions
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));

        // Social authentication
        document.querySelectorAll('.google-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('google');
            });
        });
        document.querySelectorAll('.github-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('github');
            });
        });
        document.querySelectorAll('.facebook-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('facebook');
            });
        });

        // Password strength checking
        document.getElementById('registerPassword')?.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // Password confirmation validation
        document.getElementById('confirmPassword')?.addEventListener('input', () => {
            this.validatePasswordConfirmation();
        });

        // Forgot password
        document.getElementById('forgotPassword')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Real-time email validation
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', (e) => this.validateEmail(e.target));
        });

        // Input focus animations
        document.querySelectorAll('.input-box input').forEach(input => {
            input.addEventListener('focus', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.parentElement, {
                        scale: 1.02,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
            input.addEventListener('blur', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.parentElement, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    animateFormSwitch(toForm) {
        const forms = document.querySelectorAll('.form-box');
        if (typeof gsap !== 'undefined') {
            forms.forEach(form => {
                gsap.from(form, {
                    opacity: 0,
                    x: toForm === 'register' ? 20 : -20,
                    duration: 0.5,
                    delay: 0.3,
                    ease: "power2.out"
                });
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('.btn');
        if (!this.validateEmail(document.getElementById('loginEmail'))) return;
        this.setButtonLoading(submitBtn, true);
        try {
            await this.simulateAuth({ email, password });
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome back to AlgoRhythm!', 'login');
            setTimeout(() => { this.redirectToApp(); }, 2000);
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
            this.animateInputError(document.getElementById('loginEmail'));
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        const submitBtn = e.target.querySelector('.btn');
        if (!name.trim()) {
            this.showNotification('Please enter your full name', 'error');
            this.animateInputError(document.getElementById('registerName'));
            return;
        }
        if (!this.validateEmail(document.getElementById('registerEmail'))) return;
        if (!this.validatePassword(password)) return;
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            this.animateInputError(document.getElementById('confirmPassword'));
            return;
        }
        if (!acceptTerms) {
            this.showNotification('Please accept the terms and privacy policy', 'error');
            return;
        }
        this.setButtonLoading(submitBtn, true);
        try {
            await this.simulateAuth({ name, email, password });
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome to AlgoRhythm!', 'register');
            setTimeout(() => { this.redirectToApp(); }, 2000);
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
        }
    }

    async handleSocialAuth(provider) {
        try {
            this.showNotification(`Connecting to ${provider}...`, 'info');
            await this.simulateSocialAuth(provider);
            this.showSuccessModal(`Successfully connected with ${provider}!`, 'social');
            setTimeout(() => { this.redirectToApp(); }, 2000);
        } catch {
            this.showNotification(`Failed to connect with ${provider}`, 'error');
        }
    }

    handleForgotPassword() {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            this.showNotification('Please enter your email address first', 'error');
            document.getElementById('loginEmail').focus();
            this.animateInputError(document.getElementById('loginEmail'));
            return;
        }
        if (!this.validateEmail(document.getElementById('loginEmail'))) return;
        if (typeof gsap !== 'undefined') {
            gsap.to('#forgotPassword', {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
        this.showNotification('Password reset link sent to your email!', 'success');
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.animateInputError(input);
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        this.animateInputSuccess(input);
        return true;
    }

    validatePassword(password) {
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return false;
        }
        return true;
    }

    validatePasswordConfirmation() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmPassword && password !== confirmPassword) {
            this.animateInputError(confirmInput);
            confirmInput.style.borderColor = '#ef4444';
        } else if (confirmPassword) {
            this.animateInputSuccess(confirmInput);
            confirmInput.style.borderColor = '#10b981';
        }
    }

    updatePasswordStrength(password) {
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(bar, {
                        backgroundColor: colors[Math.min(strength - 1, 4)],
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(bar, {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        scale: 0.8,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }
        });
        if (strengthText && password.length > 0) {
            strengthText.textContent = levels[Math.min(strength, 4)] || 'Very Weak';
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(strengthText, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
            }
        }
    }

    animateInputError(input) {
        if (typeof gsap !== 'undefined') {
            gsap.to(input, { x: [-5, 5, -5, 5, 0], duration: 0.5, ease: "power2.out" });
        }
        input.style.borderColor = '#ef4444';
    }

    animateInputSuccess(input) {
        input.style.borderColor = '#10b981';
        if (typeof gsap !== 'undefined') {
            gsap.to(input, { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
        }
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    setButtonSuccess(button) {
        button.classList.remove('loading');
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        if (typeof gsap !== 'undefined') {
            gsap.to(button, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
        }
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('successMessage');
        messageEl.textContent = message;
        modal.classList.add('show');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal.querySelector('.modal-content'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
        }
    }

    showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        if (typeof gsap !== 'undefined') {
            gsap.to(notification, { className: `notification ${type} show`, duration: 0.3, ease: "power2.out" });
        } else {
            notification.classList.add('show');
        }
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(notification, { opacity: 0, y: -50, duration: 0.3, ease: "power2.in", onComplete: () => notification.remove() });
            } else {
                notification.remove();
            }
        }, 4000);
    }

    setup3DBackground() {
        // ... (unchanged three.js background code)
    }

    setupMatrixEffect() {
        // ... (unchanged matrix rain code)
    }

    setupCursorFollower() {
        // ... (unchanged cursor follower code)
    }

    setupFloatingCodeAnimation() {
        if (typeof gsap !== 'undefined') {
            gsap.to('.code-snippet', { y: -10, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.5 });
        }
    }

    redirectToApp() {
        window.location.href = '/dashboard';
    }

    async simulateAuth(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.email === 'test@error.com') {
                    reject(new Error('Invalid credentials'));
                } else {
                    resolve({ success: true, data });
                }
            }, 1500);
        });
    }

    async simulateSocialAuth(provider) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true, provider });
                } else {
                    reject(new Error(`Failed to authenticate with ${provider}`));
                }
            }, 1000);
        });
    }
}

// Global functions
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();

    if (typeof gsap !== 'undefined') {
        gsap.from('.container', { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)", delay: 0.3 });
        gsap.from('.auth-header', { y: -100, opacity: 0, duration: 0.8, ease: "power2.out" });
    }

    // ✅ Added signup ↔ login toggle
    const container = document.querySelector('.container');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    registerBtn?.addEventListener('click', () => {
        container.classList.add('active');
    });
    loginBtn?.addEventListener('click', () => {
        container.classList.remove('active');
    });
});
