// Authentication Management
const auth = {
    currentUser: null,

    init() {
        // Check for stored session
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.updateUI();
        }

        // Setup event listeners
        document.getElementById('loginForm').addEventListener('submit', this.login.bind(this));
        document.getElementById('registerForm').addEventListener('submit', this.register.bind(this));
    },

    login(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = store.findUser(email);
        if (user && user.password === password) {
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUI();
            showToast('Login successful!');
            navigateTo('home');
        } else {
            showToast('Invalid credentials!', 'error');
        }
    },

    register(e) {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('phone').value,
            skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
            description: document.getElementById('description').value,
            photo: document.getElementById('photo').value,
            password: document.getElementById('registerPassword').value,
            status: 'pending'
        };

        if (store.findUser(formData.email)) {
            showToast('Email already registered!', 'error');
            return;
        }

        // Add user account
        store.addUser({
            email: formData.email,
            password: formData.password,
            isAdmin: false
        });

        // Add talent profile
        store.addTalent(formData);

        showToast('Registration successful! Waiting for admin approval.');
        navigateTo('login');
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
        this.updateUI();
        navigateTo('home');
        showToast('Logged out successfully!');
    },

    updateUI() {
        const authLinks = document.getElementById('authLinks');
        if (this.currentUser) {
            authLinks.innerHTML = `
                ${this.currentUser.isAdmin ? '<a href="#" class="nav-link" data-page="admin">Admin</a>' : ''}
                <a href="#" class="nav-link" onclick="auth.logout()">Logout</a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="#" class="nav-link" data-page="login">Login</a>
                <a href="#" class="nav-link" data-page="register">Register</a>
            `;
        }
    }
};

// Initialize auth
document.addEventListener('DOMContentLoaded', () => auth.init());