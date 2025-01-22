// Talent Display Management
const talents = {
    init() {
        this.loadTalents();
        this.setupFilters();
        this.setupEventListeners();
    },

    loadTalents() {
        const talentGrid = document.getElementById('talentGrid');
        const approvedTalents = store.getTalents().filter(t => t.status === 'approved');

        if (approvedTalents.length === 0) {
            talentGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No talents available yet</h3>
                    <p>Check back later or register as a talent!</p>
                </div>
            `;
            return;
        }

        talentGrid.innerHTML = approvedTalents.map(talent => `
            <div class="talent-card" data-email="${talent.email}">
                <img src="${talent.photo}" alt="${talent.fullName}" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="talent-card-content">
                    <h3>${talent.fullName}</h3>
                    <div class="talent-info">
                        <p class="talent-location">
                            <span class="icon">📍</span> Remote
                        </p>
                        <p class="talent-experience">
                            <span class="icon">💼</span> Available for hire
                        </p>
                    </div>
                    <p class="talent-description">${this.truncateText(talent.description, 150)}</p>
                    <div class="talent-skills">
                        ${talent.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="talent-actions">
                        ${auth.currentUser && !auth.currentUser.isAdmin ? `
                            <button onclick="talents.sendHireRequest('${talent.email}')" class="cta-button">
                                <span class="icon">✉️</span> Send Hire Request
                            </button>
                        ` : ''}
                        <button onclick="talents.viewProfile('${talent.email}')" class="cta-button" style="background-color: transparent; color: var(--primary-color); border: 2px solid currentColor;">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    setupFilters() {
        const searchInput = document.getElementById('searchTalent');
        const skillFilter = document.getElementById('skillFilter');

        // Populate skills filter
        const allSkills = new Set();
        store.getTalents().forEach(talent => {
            talent.skills.forEach(skill => allSkills.add(skill));
        });

        skillFilter.innerHTML = '<option value="">All Skills</option>' + 
            Array.from(allSkills).sort().map(skill => 
                `<option value="${skill}">${skill}</option>`
            ).join('');

        // Add event listeners with debounce
        searchInput.addEventListener('input', this.debounce(() => this.filterTalents(), 300));
        skillFilter.addEventListener('change', () => this.filterTalents());
    },

    setupEventListeners() {
        // Listen for talent status changes
        document.addEventListener('talentStatusChanged', () => {
            this.loadTalents();
            this.setupFilters();
        });
    },

    filterTalents() {
        const searchTerm = document.getElementById('searchTalent').value.toLowerCase();
        const selectedSkill = document.getElementById('skillFilter').value;
        const talentGrid = document.getElementById('talentGrid');

        // Add loading state
        talentGrid.classList.add('loading');

        setTimeout(() => {
            const filteredTalents = store.getTalents().filter(talent => {
                const matchesSearch = talent.fullName.toLowerCase().includes(searchTerm) ||
                                    talent.description.toLowerCase().includes(searchTerm) ||
                                    talent.skills.some(skill => skill.toLowerCase().includes(searchTerm));
                const matchesSkill = !selectedSkill || talent.skills.includes(selectedSkill);
                return talent.status === 'approved' && matchesSearch && matchesSkill;
            });

            talentGrid.innerHTML = filteredTalents.length ? filteredTalents.map(talent => `
                <div class="talent-card" data-email="${talent.email}">
                    <img src="${talent.photo}" alt="${talent.fullName}"
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    <div class="talent-card-content">
                        <h3>${talent.fullName}</h3>
                        <div class="talent-info">
                            <p class="talent-location">
                                <span class="icon">📍</span> Remote
                            </p>
                            <p class="talent-experience">
                                <span class="icon">💼</span> Available for hire
                            </p>
                        </div>
                        <p class="talent-description">${this.truncateText(talent.description, 150)}</p>
                        <div class="talent-skills">
                            ${talent.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        <div class="talent-actions">
                            ${auth.currentUser && !auth.currentUser.isAdmin ? `
                                <button onclick="talents.sendHireRequest('${talent.email}')" class="cta-button">
                                    <span class="icon">✉️</span> Send Hire Request
                                </button>
                            ` : ''}
                            <button onclick="talents.viewProfile('${talent.email}')" class="cta-button" style="background-color: transparent; color: var(--primary-color); border: 2px solid currentColor;">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            `).join('') : `
                <div class="empty-state">
                    <h3>No matching talents found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;

            talentGrid.classList.remove('loading');
        }, 300);
    },

    sendHireRequest(talentEmail) {
        if (!auth.currentUser) {
            showToast('Please login to send hire requests!', 'error');
            navigateTo('login');
            return;
        }

        const request = {
            id: this.generateId(),
            clientEmail: auth.currentUser.email,
            talentEmail: talentEmail,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        const talentCard = document.querySelector(`[data-email="${talentEmail}"]`);
        talentCard.classList.add('loading');

        setTimeout(() => {
            store.addHireRequest(request);
            showToast('Hire request sent successfully!', 'success');
            talentCard.classList.remove('loading');
        }, 500);
    },

    viewProfile(email) {
        const talent = store.getTalents().find(t => t.email === email);
        if (talent) {
            const profileContent = document.getElementById('profileContent');
            profileContent.innerHTML = `
                <div class="profile-header">
                    <img src="${talent.photo}" alt="${talent.fullName}" class="profile-photo"
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    <div class="profile-info">
                        <h2>${talent.fullName}</h2>
                        <p class="profile-contact">
                            <span class="icon">📧</span> ${talent.email}
                            <span class="icon">📱</span> ${talent.phone}
                        </p>
                    </div>
                </div>
                <div class="profile-body">
                    <div class="profile-section">
                        <h3>About</h3>
                        <p>${talent.description}</p>
                    </div>
                    <div class="profile-section">
                        <h3>Skills</h3>
                        <div class="talent-skills">
                            ${talent.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    ${auth.currentUser && !auth.currentUser.isAdmin ? `
                        <div class="profile-actions">
                            <button onclick="talents.sendHireRequest('${talent.email}')" class="cta-button">
                                <span class="icon">✉️</span> Send Hire Request
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
            navigateTo('profile');
        }
    },

    // Utility functions
    truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};