document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.querySelector('#emailId').value.trim();
      const password = document.querySelector('#password').value.trim();
  
      try {
        const response = await fetch('/api/users/login', {
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
  


// const loginFormHandler = async (event) => {
//     event.preventDefault();
  
//     // Collect values from the login form
//     const email = document.querySelector('#email-login').value.trim();
//     const password = document.querySelector('#password-login').value.trim();
  
//     if (email && password) {
//       // Send a POST request to the API endpoint
//       const response = await fetch('/api/users/login', {
//         method: 'POST',
//         body: JSON.stringify({ emailId: email, password }),
//         headers: { 'Content-Type': 'application/json' },
//       });
  
//       if (response.ok) {
//         // If successful, redirect the browser to the profile page
//         document.location.replace('/profile');
//       } else {
//         alert(response.statusText);
//       }
//     }
//   };
  
//   const signupFormHandler = async (event) => {
//     event.preventDefault();
  
//     const firstName = document.querySelector('#firstName-signup').value.trim();
//     const lastName = document.querySelector('#lastName-signup').value.trim();
//     const email = document.querySelector('#email-signup').value.trim();
//     const password = document.querySelector('#password-signup').value.trim();
  
//     if (firstName && lastName && email && password) {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         body: JSON.stringify({ firstName, lastName, emailId: email, password }), // Ensure `emailId` matches backend field
//         headers: { 'Content-Type': 'application/json' },
//       });
  
//       if (response.ok) {
//         document.location.replace('/profile');
//       } else {
//         alert(response.statusText);
//       }
//     }
//   };
  
//   document
//     .querySelector('.login-form')
//     .addEventListener('submit', loginFormHandler);
  
//   document
//     .querySelector('.register-form')
//     .addEventListener('submit', signupFormHandler);