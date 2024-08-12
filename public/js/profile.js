
const dataContainerEl = document.getElementById("dataContainer");
const recvNoteCntEl = document.getElementById("recvdNotes");
const sentNoteCntEl = document.getElementById("sentNotes");

const alertMsgEl = document.getElementById('alertMsgContainer');
const sendThanksFormEl = document.getElementById("sendThanksForm");
const sendThanksContainerEl = document.getElementById('sendThanksContainer');
const templaeEls = document.querySelectorAll('div[id^="img"]');
const msgEl = document.getElementById("thankyounote");
const receiverUserEl = document.getElementById("receiver");
const reset = document.getElementById("reset");


let recvdNotesCnt = 0;
let sentNotesCnt = 0;
let selectedTemplateLink;

// ----- Helper methods -----
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

function clearFields() {
    msgEl.value = "";
    msgEl.style = "";
    receiverUserEl.value = "";
}


// ----- Functions to make api calls ----

// GET /sessiondata
async function getSessionData() {
    try {
        const res = await fetch("/sessiondata");
        const data = await res.json();
        return data;

    } catch (err) {
        // TODO: Render error message in an alert box
        console.log("error: ", err)
    };
}

// ----- Event  listeners and callbacks----
function handleCardTemplateClickEvent(event) {
    clearAlertMsgContainer();
    selectedTemplateLink = event.target.dataset.img
    msgEl.style.backgroundImage = "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('" + selectedTemplateLink + "')";
    msgEl.style.backgroundSize = "cover";
    msgEl.style.backgroundPosition = "center"
}

async function thanksFormSubmitEventHandler(event) {
    // prevent form defualt behavior
    event.preventDefault();
    // get receiver user id
    const rUser = receiverUserEl.value;
    const msg = msgEl.value;
    console.log("in form: ", rUser);

    // Validate inputs 
    if (rUser === "" || msg === "") {
        // if not all inputs display and alert msg
        return displayMsgInAlertContainer("Please fill all the fields in the form!", "danger");
    } else {
        // construct the note 
        const noteData = `<div class=\"h-50\" style=\"min-height: 150px; background-size: cover; background-position: center; background-image:linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),url('${selectedTemplateLink}')\">${msg}</div>`
        console.log(noteData);

        // get logged in user id
        const sessionData = await getSessionData();
        const loggedUserId = sessionData.user_id

        // invoke  POST/api/appreciation/ call 
        try {
            const response = await fetch('/api/appreciation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sender_id: loggedUserId,
                    receiver_name: rUser,
                    message: noteData
                })
            });

            if (response.ok) {
                displayMsgInAlertContainer("Note sent successfuly!", "info");
                clearFields();
            } else {
                const data = await response.json()
                displayMsgInAlertContainer("Failed to send note to user. Error: " + data, "danger");
                clearFields();
            }

        } catch (error) {
            console.error('Error while trying to post a thank you note', error);
            // upon success post a msg on the alert text box 
            displayMsgInAlertContainer("Error while posting an appreciation. " + error, "danger");
            //TODO:  update sent count value



            // clear the input msg
            clearFields();
        }
    }
    // TODO: 
    return;
}

// Tasks to perform when the page loads
async function initWindowFunction() {
    const sessionData = await getSessionData();
    const loggedUserId = sessionData.user_id
    console.log("logged In user id: ", loggedUserId);

    // Initialize autoComplete
    const autoCompleteJS = new autoComplete({
        selector: '#receiver',
        placeHolder: 'Type to search...',
        data: {
            src: async function (query) {
                try {
                    const response = await fetch(`api/user/`);
                    const data = await response.json();

                    return data; // Return the fetched data
                } catch (error) {
                    console.error('Error fetching data:', error);
                    return []; // Return an empty array in case of error
                }
            },
            cache: false
        },
        resultItem: {
            highlight: true,
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    console.log("selection: ", selection);
                    autoCompleteJS.input.value = selection;
                    document.getElementById("autoComplete_list_1").style.display = "hidden"
                }
            }
        }
    });

}


// Tasks to perform when send thanks form is submitted
sendThanksFormEl.addEventListener('submit', thanksFormSubmitEventHandler);

// Tasks to prform when card template is clicked
for (t of templaeEls) {
    t.addEventListener("click", (event) => handleCardTemplateClickEvent(event));
}

// Clear alert message field when usr clicks on the msg text area
msgEl.addEventListener("click", () => {
    clearAlertMsgContainer();
})

// Clear alert message field when usr clicks on the receiver user text box
receiverUserEl.addEventListener("click", () => {
    clearAlertMsgContainer();
})

reset.addEventListener("click", () => {
    clearFields();
    clearAlertMsgContainer();
});



window.onload = initWindowFunction;