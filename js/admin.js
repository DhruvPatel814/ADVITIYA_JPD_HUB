// Admin Dashboard Management
const admin = {
    init() {
        if (auth.currentUser?.isAdmin) {
            this.loadDashboardStats();
            this.loadPendingProfiles();
            this.loadHireRequests();
            this.setupEventListeners();
        }
    },

    loadDashboardStats() {
        const talents = store.getTalents();
        const requests = store.getHireRequests();
        
        const stats = {
            totalTalents: talents.length,
            pendingApprovals: talents.filter(t => t.status === 'pending').length,
            approvedTalents: talents.filter(t => t.status === 'approved').length,
            activeRequests: requests.filter(r => r.status === 'pending').length
        };

        document.getElementById('adminStats').innerHTML = `
            <div class="stat-card">
                <h4>Total Talents</h4>
                <div class="value">${stats.totalTalents}</div>
            </div>
            <div class="stat-card">
                <h4>Pending Approvals</h4>
                <div class="value">${stats.pendingApprovals}</div>
            </div>
            <div class="stat-card">
                <h4>Approved Talents</h4>
                <div class="value">${stats.approvedTalents}</div>
            </div>
            <div class="stat-card">
                <h4>Active Requests</h4>
                <div class="value">${stats.activeRequests}</div>
            </div>
        `;
    },

    loadPendingProfiles() {
        const pendingList = document.getElementById('pendingList');
        const pendingTalents = store.getTalents().filter(t => t.status === 'pending');

        if (pendingTalents.length === 0) {
            pendingList.innerHTML = `
                <div class="empty-state">
                    <p>No pending profiles to review</p>
                </div>
            `;
            return;
        }

        pendingList.innerHTML = pendingTalents.map(talent => `
            <div class="talent-card" data-email="${talent.email}">
                <img src="${talent.photo}" alt="${talent.fullName}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="talent-card-content">
                    <h3>${talent.fullName}</h3>
                    <div class="talent-info">
                        <p><strong>Email:</strong> ${talent.email}</p>
                        <p><strong>Phone:</strong> ${talent.phone}</p>
                    </div>
                    <div class="talent-description">
                        <h4>About</h4>
                        <p>${talent.description}</p>
                    </div>
                    <div class="talent-skills">
                        ${talent.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="action-buttons">
                        <button onclick="admin.approveTalent('${talent.email}')" class="cta-button">
                            <span class="icon">✓</span> Approve
                        </button>
                        <button onclick="admin.rejectTalent('${talent.email}')" class="cta-button" style="background-color: var(--error-color)">
                            <span class="icon">✕</span> Reject
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    loadHireRequests() {
        const requestsList = document.getElementById('requestsList');
        const requests = store.getHireRequests();

        if (requests.length === 0) {
            requestsList.innerHTML = `
                <div class="empty-state">
                    <p>No hire requests yet</p>
                </div>
            `;
            return;
        }

        requestsList.innerHTML = requests.map(request => {
            const talent = store.getTalents().find(t => t.email === request.talentEmail);
            const statusColors = {
                pending: 'var(--warning-color)',
                approved: 'var(--success-color)',
                rejected: 'var(--error-color)'
            };

            return `
                <div class="hire-request" data-id="${request.id}">
                    <div class="request-header">
                        <h4>Request from ${request.clientEmail}</h4>
                        <span class="request-status" style="color: ${statusColors[request.status]}">
                            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                    </div>
                    <div class="request-details">
                        <p><strong>Talent:</strong> ${talent?.fullName || request.talentEmail}</p>
                        <p><strong>Date:</strong> ${new Date(request.timestamp).toLocaleDateString()}</p>
                    </div>
                    ${request.status === 'pending' ? `
                        <div class="action-buttons">
                            <button onclick="admin.updateRequestStatus('${request.id}', 'approved')" class="cta-button">
                                Approve Request
                            </button>
                            <button onclick="admin.updateRequestStatus('${request.id}', 'rejected')" class="cta-button" style="background-color: var(--error-color)">
                                Reject Request
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    setupEventListeners() {
        // Add any additional event listeners for admin functionality
        document.addEventListener('talentStatusChanged', () => {
            this.loadDashboardStats();
            this.loadPendingProfiles();
        });

        document.addEventListener('hireRequestUpdated', () => {
            this.loadDashboardStats();
            this.loadHireRequests();
        });
    },

    approveTalent(email) {
        const talentCard = document.querySelector(`[data-email="${email}"]`);
        talentCard.classList.add('loading');

        setTimeout(() => {
            store.updateTalent(email, { status: 'approved' });
            document.dispatchEvent(new CustomEvent('talentStatusChanged'));
            showToast('Talent profile approved!', 'success');
            talentCard.classList.remove('loading');
        }, 500);
    },

    rejectTalent(email) {
        if (confirm('Are you sure you want to reject this talent?')) {
            const talentCard = document.querySelector(`[data-email="${email}"]`);
            talentCard.classList.add('loading');

            setTimeout(() => {
                store.updateTalent(email, { status: 'rejected' });
                document.dispatchEvent(new CustomEvent('talentStatusChanged'));
                showToast('Talent profile rejected!', 'error');
                talentCard.classList.remove('loading');
            }, 500);
        }
    },

    updateRequestStatus(requestId, status) {
        const requests = store.getHireRequests();
        const index = requests.findIndex(r => r.id === requestId);
        
        if (index !== -1) {
            requests[index].status = status;
            localStorage.setItem('hireRequests', JSON.stringify(requests));
            document.dispatchEvent(new CustomEvent('hireRequestUpdated'));
            showToast(`Hire request ${status}!`, status === 'approved' ? 'success' : 'error');
        }
    }
};