const logout = document.getElementById("logout");

logout.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/user/logout', {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('sucessfully logged out')
      window.location.href = '/';
    } else {
      console.log("Error while trying to logged out: ", response);
    }
  } catch (err) {
    console.log("Error while trying to log out: ", err);
  }
});