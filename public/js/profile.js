document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('#logout');
    console.log('here')
    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        const response = await fetch('/api/user/logout', {
          method: 'DELETE',
        });
        if (response.ok) {
            console.log('sucessful')
          window.location.href = '/';
        } else {
          alert(response.statusText);
        }
      });
    }
  });
  