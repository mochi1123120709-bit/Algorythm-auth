// Core Authentication Manager
class AuthManager {
    constructor() {
        this.showLoadingScreen();
        this.init();
        this.setupEventListeners();
        this.setup3DBackground();
        this.setupMatrixEffect();
        this.setupCursorFollower();
        this.setupFloatingCodeAnimation();
        this.hideLoadingScreen();
    }

    init() {
        this.container = document.getElementById('container');
        this.registerBtn = document.getElementById('registerBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        console.log('AuthManager initialized');
    }

    showLoadingScreen() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        }, 1500);
    }

    setupEventListeners() {
        // Register button click event - switches to register form
        if (this.registerBtn) {
            this.registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Register button clicked - switching to register');
                this.container.classList.add('active');
                this.animateTransition('register');
            });
        } else {
            console.error('Register button not found!');
        }

        // Login button click event - switches to login form
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Login button clicked - switching to login');
                this.container.classList.remove('active');
                this.animateTransition('login');
            });
        } else {
            console.error('Login button not found!');
        }

        // Form submissions
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

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

        document.querySelectorAll('.linkedin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('linkedin');
            });
        });

        // Forgot password
        const forgotPasswordLink = document.getElementById('forgotPassword');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Input focus animations
        document.querySelectorAll('.input-box input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02) translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });

            // Real-time validation feedback
            input.addEventListener('input', function() {
                this.classList.remove('error');
                if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        this.classList.add('error');
                    }
                }
            });
        });
    }

    animateTransition(toForm) {
        console.log(`Animating transition to: ${toForm}`);
        
        if (typeof gsap !== 'undefined') {
            const forms = document.querySelectorAll('.form-box');
            
            forms.forEach(form => {
                gsap.from(form, {
                    opacity: 0,
                    x: toForm === 'register' ? 30 : -30,
                    duration: 0.6,
                    delay: 0.4,
                    ease: "power3.out"
                });
            });

            // Animate form elements
            const activeForm = toForm === 'register' ? '.form-box.register' : '.form-box.login';
            gsap.from(`${activeForm} .input-box`, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                delay: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('.btn');

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateAuth({ email, password });
            
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome back to AlgoRhythm!');
            
            setTimeout(() => {
                this.redirectToApp();
            }, 2000);
            
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = e.target.querySelector('.btn');

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'error');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showNotification('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'error');
            return;
        }

        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateAuth({ name, email, password });
            
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome to AlgoRhythm!');
            
            setTimeout(() => {
                this.redirectToApp();
            }, 2000);
            
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    async handleSocialAuth(provider) {
        try {
            this.showNotification(`Connecting to ${provider}...`, 'info');
            
            // Simulate social auth
            await this.simulateSocialAuth(provider);
            
            this.showSuccessModal(`Successfully connected with ${provider}!`);
            
            setTimeout(() => {
                this.redirectToApp();
            }, 2000);
            
        } catch (error) {
            this.showNotification(`Failed to connect with ${provider}`, 'error');
        }
    }

    handleForgotPassword() {
        const email = document.getElementById('loginEmail').value;
        
        if (!email) {
            this.showNotification('Please enter your email address first', 'error');
            document.getElementById('loginEmail').focus();
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        this.showNotification('Password reset link sent to your email!', 'success');
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
        
        // Add success animation
        if (typeof gsap !== 'undefined') {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('successMessage');
        
        if (messageEl) messageEl.textContent = message;
        if (modal) modal.classList.add('show');

        // Add entrance animation
        if (typeof gsap !== 'undefined') {
            gsap.from('.modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // 3D Background setup
    setup3DBackground() {
        const canvas = document.getElementById('auth-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating shapes
        const shapes = [];
        
        for (let i = 0; i < 40; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0x6366F1 : 0x8B5CF6, 
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            scene.add(cube);
            shapes.push(cube);
        }

        // Central music cube
        const musicGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const musicMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366F1,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const musicCube = new THREE.Mesh(musicGeometry, musicMaterial);
        scene.add(musicCube);

        camera.position.z = 12;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.003;
                shape.rotation.y += 0.003;
                shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.003;
            });

            musicCube.rotation.x += 0.006;
            musicCube.rotation.y += 0.010;
            musicCube.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.1);

            camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Matrix effect
    setupMatrixEffect() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン".split("");
        const font_size = 12;
        const columns = canvas.width / font_size;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#6366F1';
            ctx.font = font_size + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);

                if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 60);

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupCursorFollower() {
        const follower = document.querySelector('.cursor-follower');
        if (!follower) return;

        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;
            
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };

        animateFollower();
    }

    setupFloatingCodeAnimation() {
        if (typeof gsap !== 'undefined') {
            gsap.to('.code-snippet', {
                y: -15,
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.3
            });
        }
    }

    redirectToApp() {
        // Show loading before redirect
        this.showLoadingScreen();
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
    }

    async simulateAuth(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.email === 'test@error.com') {
                    reject(new Error('Invalid credentials'));
                } else {
                    resolve({ success: true, data });
                }
            }, 2000);
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
            }, 1500);
        });
    }
}

// Global functions
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('show');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AuthManager...');
    new AuthManager();
    
    // Entrance animations
    if (typeof gsap !== 'undefined') {
        // Initial page load animations
        gsap.set('.container', { scale: 0.9, opacity: 0 });
        gsap.set('.auth-header', { y: -100, opacity: 0 });
        gsap.set('.music-visualizer', { x: 100, opacity: 0 });
        
        gsap.from('.container', {
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.7)",
            delay: 1.8
        });
        
        gsap.from('.auth-header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1.6
        });
        
        gsap.from('.music-visualizer', {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 2
        });

        // Animate form elements on initial load
        gsap.from('.form-box.login .input-box', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: 2.2,
            stagger: 0.1,
            ease: "power2.out"
        });

        gsap.from('.form-box.login .btn', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 2.8,
            ease: "power2.out"
        });
    }
});
