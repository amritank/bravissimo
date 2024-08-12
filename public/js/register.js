var myWidget = cloudinary.createUploadWidget({
  cloudName: window.CLOUDINARY_CLOUD_NAME,
  uploadPreset: window.CLOUDINARY_UPLOAD_PRESET,
}, (error, result) => {
  if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
  }
})
document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);

document.addEventListener('DOMContentLoaded', () => {
  const cancelButton = document.querySelector('#btn-cancel');

  cancelButton.addEventListener('click', () => {
    window.location.href = '/'; 
  });
});


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
        const response = await fetch('/api/user/register', {
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
        if (response.ok) {
          let countdown = 5;
          const messageDiv = document.getElementById('message');
          messageDiv.innerHTML = `Successfully registered! You will be redirected to the login page in ${countdown} seconds...`;
          const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
              messageDiv.innerHTML = `Successfully registered! You will be redirected to the login page in ${countdown} seconds...`;
            } else {
              clearInterval(countdownInterval);
              window.location.href = '/login'; 
            }
          }, 1000); 
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
