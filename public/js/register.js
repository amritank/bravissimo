const alertMsgEl = document.getElementById("alertMsgContainer");
const firstNameEl = document.querySelector('#first_name');
const lastNameEl = document.querySelector('#last_name');
const emailEl = document.querySelector('#email_id');
const passwordEl = document.querySelector('#password');
const profileImgEl = document.querySelector('#profile_img');
const profileImgLblEl = document.querySelector('#profile_img_lbl');


// cloudinary widget
var myWidget = cloudinary.createUploadWidget({
  cloudName: window.CLOUDINARY_CLOUD_NAME,
  uploadPreset: window.CLOUDINARY_UPLOAD_PRESET,
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log('Done! Here is the image info: ', result.info);
    // displayMsgInAlertContainer("Image uploaded successfully at: " + result.info.url, "info");
    profileImgEl.textContent = result.info.url;
  }
})
document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const cancelButton = document.querySelector('#btn-cancel');

  cancelButton.addEventListener('click', () => {
    window.location.href = '/#login';
  });
});


function clearFields() {
  firstNameEl.value = "";
  lastNameEl.value = "";
  emailEl.value = "";
  passwordEl.value = "";
  profileImgEl.textContent = "";
}

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

function parseDbErrorToUserFriendlyError(error) {
  if (error.includes("emailId must be unique")) {
    return "An account already exists with that emailId.";
  } else {
    return error;
  }
}

// ----- Event listeners -----
document.addEventListener('DOMContentLoaded', () => {
  const cancelButton = document.querySelector('#btn-cancel');

  cancelButton.addEventListener('click', () => {
    window.location.href = '/#login';
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register-form');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = firstNameEl.value;
    const lastName = lastNameEl.value;
    const email = emailEl.value;
    const password = passwordEl.value;
    const profileImg = profileImgEl.textContent;
    console.log("profile img value: ", profileImg);

    if (firstName === "" || lastName === "" || email === "" || password === "") {
      return displayMsgInAlertContainer("Please fill all the fields in the form!", "danger");
    }


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

      // if (response.ok) {
      //   window.location.href = '/';
      // } else {
      //   const errorText = await response.text();
      //   // alert(`Error: ${errorText}`);
      //   return displayMsgInAlertContainer("Error while trying to register user: " + errorText, "danger");
      // }
      if (response.ok) {
        clearFields();
        let countdown = 5;
        const messageDiv = document.getElementById('message');
        // messageDiv.innerHTML = `Successfully registered! You will be redirected to the login page in ${countdown} seconds...`;
        displayMsgInAlertContainer(`Successfully registered! You will be redirected to the login page in ${countdown} seconds...`, "info")
        const countdownInterval = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            // messageDiv.innerHTML = `Successfully registered! You will be redirected to the login page in ${countdown} seconds...`;
            displayMsgInAlertContainer(`Successfully registered! You will be redirected to the login page in ${countdown} seconds...`, "info")
          } else {
            clearInterval(countdownInterval);
            window.location.href = '/#login';
          }
        }, 1000);
      } else {
        const err = await response.json()

        //console.log(errorText);
        // console.log(err);
        // console.log(typeof (err));
        // console.log("one msg: ", err.errors[0].message);
        // alert(`Error: ${errorText}`);
        const ufError = parseDbErrorToUserFriendlyError(err.errors[0].message);
        return displayMsgInAlertContainer("Error while registering: " + ufError, "danger")

      }
    } catch (error) {
      console.error('Unexpected error while registering:', error);
      //alert('An error occurred. Please try again.');
      return displayMsgInAlertContainer("Unexpected error while registering: " + error, "danger");

    }
  });

});

for (const ele of [firstNameEl, lastNameEl, emailEl, passwordEl]) {
  ele.addEventListener("click", clearAlertMsgContainer);
}