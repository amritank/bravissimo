document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#register-form');
  
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const firstName = document.querySelector('#first_name').value;
      const lastName = document.querySelector('#last_name').value;
      const email = document.querySelector('#email_id').value;
      const password = document.querySelector('#password').value;
      const profileImg = document.querySelector('#profile_img').value;
  
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            emailId: email,
            password: password,
            profileImg: profileImg
          }) 
        });
  
        if (response.ok) {
          window.location.href = '/login';
        } else {
          const errorText = await response.text();
          alert(`Error: ${errorText}`);
        }
      } catch (error) {
        console.error('Error registering:', error);
        alert('An error occurred. Please try again.');
      }
    });
  });
  