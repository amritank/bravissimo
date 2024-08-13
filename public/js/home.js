const alertMsgEl = document.getElementById("alertMsgContainer");
const emailEl = document.querySelector('#emailId');
const pwdEl = document.querySelector('#password');

function clearAlertMsgContainer() {
  alertMsgEl.textContent = ""
  alertMsgEl.display = "none";
  alertMsgEl.classList.remove("alert-primary");
  alertMsgEl.classList.remove("alert-danger");
  alertMsgEl.classList.remove("alert");
  alertMsgEl.classList.remove("mb-5");
}

function displayMsgInAlertContainer(msg, msgType) {
  alertMsgEl.display = "block";
  alertMsgEl.textContent = msg;
  if (msgType === "info") {
    alertMsgEl.classList.add("alert", "alert-primary", "mb-1");
  } else {
    alertMsgEl.classList.add("alert", "alert-danger", "mb-1");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailEl.value.trim();
    const password = pwdEl.value.trim();
    if (email === "" || password === "") {
      return displayMsgInAlertContainer("Please fill all the fields in the form!", "danger");
    }

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailId: email, password: password })
      });

      if (response.ok) {
        window.location.href = '/received';
      } else {
        const errorText = await response.json();
        return displayMsgInAlertContainer(errorText.message, "danger");
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return displayMsgInAlertContainer("Unexpected error while trying to login. Error: " + error, "danger");
    }
  });
});


pwdEl.addEventListener("click", () => {
  clearAlertMsgContainer();
})

// Clear alert message field when usr clicks on the receiver user text box
emailEl.addEventListener("click", () => {
  clearAlertMsgContainer();
})


