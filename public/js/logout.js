const logout = async () => {
    // Send a POST request to the logout endpoint
const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // If logout is successful, redirect to the homepage
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};
// Attach the logout function to the click event of the logout button
document.querySelector('#logout').addEventListener('click', logout);