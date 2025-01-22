// Add to auth.js or create new file
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('fullName', document.getElementById('fullName').value);
    formData.append('registerEmail', document.getElementById('registerEmail').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('skills', document.getElementById('skills').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('photo', document.getElementById('photo').value);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Show success message
            document.getElementById('toast').textContent = 'Registration successful!';
            document.getElementById('toast').classList.add('show');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});