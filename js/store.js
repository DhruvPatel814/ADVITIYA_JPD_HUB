// Local Storage Management
const store = {
    // Initialize store with default data
    init() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([{
                email: 'admin@admin.com',
                password: 'admin123',
                isAdmin: true
            }]));
        }
        if (!localStorage.getItem('talents')) {
            localStorage.setItem('talents', JSON.stringify([]));
        }
        if (!localStorage.getItem('hireRequests')) {
            localStorage.setItem('hireRequests', JSON.stringify([]));
        }
    },

    // User Management
    getUsers() {
        return JSON.parse(localStorage.getItem('users'));
    },

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },

    findUser(email) {
        return this.getUsers().find(user => user.email === email);
    },

    // Talent Management
    getTalents() {
        return JSON.parse(localStorage.getItem('talents'));
    },

    addTalent(talent) {
        const talents = this.getTalents();
        talents.push(talent);
        localStorage.setItem('talents', JSON.stringify(talents));
    },

    updateTalent(email, updates) {
        const talents = this.getTalents();
        const index = talents.findIndex(t => t.email === email);
        if (index !== -1) {
            talents[index] = { ...talents[index], ...updates };
            localStorage.setItem('talents', JSON.stringify(talents));
        }
    },

    // Hire Requests Management
    getHireRequests() {
        return JSON.parse(localStorage.getItem('hireRequests'));
    },

    addHireRequest(request) {
        const requests = this.getHireRequests();
        requests.push(request);
        localStorage.setItem('hireRequests', JSON.stringify(requests));
    }
};

// Initialize store
store.init();