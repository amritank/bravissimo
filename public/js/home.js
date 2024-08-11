document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.querySelector('#emailId').value.trim();
      const password = document.querySelector('#password').value.trim();
  
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ emailId: email, password: password })
        });
  
        if (response.ok) {
          window.location.href = '/profile';
        } else {
          const errorText = await response.text();
          alert(`Error: ${errorText}`);
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.');
      }
    });
  });
  


