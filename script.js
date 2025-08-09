// Core Authentication Manager
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
        this.container = document.getElementById('container');
        this.registerBtn = document.getElementById('registerBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        console.log('AuthManager initialized');
        console.log('Register button:', this.registerBtn);
        console.log('Login button:', this.loginBtn);
        console.log('Container:', this.container);
    }

    setupEventListeners() {
        // CRITICAL: Register button click event
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

        // CRITICAL: Login button click event
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
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
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

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
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

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
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
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('successMessage');
        
        if (messageEl) messageEl.textContent = message;
        if (modal) modal.classList.add('show');
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
        }, 4000);
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
        
        for (let i = 0; i < 30; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xF59E0B, 
                wireframe: true,
                transparent: true,
                opacity: 0.4
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
            color: 0xF59E0B,
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
                shape.rotation.x += 0.005;
                shape.rotation.y += 0.005;
                shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.003;
            });

            musicCube.rotation.x += 0.008;
            musicCube.rotation.y += 0.012;
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

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+-=[]{}|;:,.<>?".split("");
        const font_size = 12;
        const columns = canvas.width / font_size;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#F59E0B';
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

        setInterval(draw, 50);
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
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };

        animateFollower();
    }

    setupFloatingCodeAnimation() {
        if (typeof gsap !== 'undefined') {
            gsap.to('.code-snippet', {
                y: -10,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.5
            });
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
    if (modal) modal.classList.remove('show');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AuthManager...');
    new AuthManager();
    
    // Entrance animations
    if (typeof gsap !== 'undefined') {
        gsap.from('.container', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.3
        });
        
        gsap.from('.auth-header', {
            y: -100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        gsap.from('.music-visualizer', {
            x: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.5
        });
    }
});
