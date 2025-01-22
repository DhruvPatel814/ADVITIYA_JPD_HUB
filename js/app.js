// Main Application Logic
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Update URL hash
    window.location.hash = pageId;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Setup Navigation
document.querySelectorAll('[data-page]').forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(e.target.dataset.page);
    });
});

// Handle browser back/forward
window.addEventListener('hashchange', () => {
    const pageId = window.location.hash.slice(1) || 'home';
    navigateTo(pageId);
});

// Initialize Components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    talents.init();
    admin.init();

    // Handle initial hash route
    const initialPage = window.location.hash.slice(1) || 'home';
    navigateTo(initialPage);

    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => img.classList.add('error'));
    });
});