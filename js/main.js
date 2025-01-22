const notificationForm = document.getElementById('notificationForm');
const responseMessage = document.getElementById('responseMessage');

notificationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;

  try {
    const response = await fetch('http://127.0.0.1:5000/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, message }),
    });

    const result = await response.json();
    if (response.ok) {
      responseMessage.textContent = `Notification sent! SID: ${result.sid}`;
    } else {
      responseMessage.textContent = `Error: ${result.message}`;
    }
  } catch (error) {
    responseMessage.textContent = `Error: ${error.message}`;
  }
});
