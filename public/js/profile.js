const recvNotesEle = document.getElementById("recvdNotesLink");
const dataContainerEl = document.getElementById("dataContainer");
const recvNoteCntEl = document.getElementById("recvdNotes");
const sentNoteCntEl = document.getElementById("sentNotes");
const recvdNotesLinkEl = document.getElementById("recvdNotesLink");
const sentNotesLinkEl = document.getElementById("sentNotesLink");
const sendThanksLinkEL = document.getElementById("sendThanksLink");
const alertMsgEl = document.getElementById("alertMsgContainer");
const sendThanksFormEl = document.getElementById("sendThanksForm");
const sendThanksContainerEl = document.getElementById('sendThanksContainer');
const templaeEls = document.querySelectorAll('div[id^="img"]');
const msgEl = document.getElementById("thankyounote");
const receiverUserEl = document.getElementById("receiver");
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
}

function displayMsgInAlertContainer(msg, msgType) {
    alertMsgEl.display = "block";
    alertMsgEl.textContent = msg;
    if (msgType === "info") {
        alertMsgEl.classList.add("alert", "alert-primary");
    } else {
        alertMsgEl.classList.add("alert", "alert-danger");
    }
}

function clearFields() {
    msgEl.value = "";
    msgEl.style = "";
    receiverUserEl.value = "";
}

// ----- Functions to render html  ----
function renderUserDetails(userData) {
    console.log("In render: ", userData);
    // render name
    const userEl = document.getElementById("user")
    const firstLetter = userData.firstName.charAt(0);
    const rest = userData.firstName.slice(1)
    userEl.innerHTML = "Hello, " + firstLetter.toUpperCase() + rest + "!";

    // render profile image
    const profileImgEl = document.getElementById("profileImg");
    profileImgEl.style.backgroundImage = "url(" + userData.profileImg + ")";
    profileImgEl.style.backgroundSize = "cover";
}

// Render receiver notes to ui
function renderReceiveNotesHTML(data) {
    console.log("rendering received notes:");
    for (entry of data) {
        const divContainerEl = document.createElement("div");
        divContainerEl.style.width = "80%";
        divContainerEl.style.boxShadow = "10px 5px 5px lightgray";
        divContainerEl.classList.add("card", "mb-4");
        const divContentContainerEl = document.createElement("div");
        divContentContainerEl.classList.add("card-body");
        divContentContainerEl.innerHTML = entry.message;
        const pEl = document.createElement("p");
        pEl.style.textAlign = "right";
        pEl.classList.add("text-black-50");
        pEl.innerHTML = "<small>By " + entry.Sender.firstName + " " + entry.Sender.lastName + " on " +
            (new Date(entry.createdAt))
                .toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short'
                })
            + "</small";
        divContentContainerEl.append(pEl);
        divContainerEl.append(divContentContainerEl);
        dataContainerEl.appendChild(divContainerEl);
        //TODO: Need to add section displaying sender (By xyz) and date (on date)
    }
}

// Render sender notes to ui
function renderSentNotesHTML(data) {
    for (entry of data) {
        const divContainerEl = document.createElement("div");
        divContainerEl.style.width = "80%";
        divContainerEl.style.boxShadow = "10px 5px 5px lightgray";
        divContainerEl.classList.add("card", "mb-4");
        const divContentContainerEl = document.createElement("div");
        divContentContainerEl.classList.add("card-body", "h-50");
        divContentContainerEl.innerHTML = entry.message;
        const pEl = document.createElement("p");
        pEl.style.textAlign = "right";
        pEl.classList.add("text-black-50");
        pEl.innerHTML = "<small>To " + entry.Receiver.firstName + " " + entry.Receiver.lastName + " on " +
            (new Date(entry.createdAt))
                .toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short'
                })
            + "</small";
        divContentContainerEl.append(pEl);
        divContainerEl.append(divContentContainerEl);
        dataContainerEl.appendChild(divContainerEl);
        // TODO: We als need to show the edit and delete icons
        // save the note id as a data attribute and add a click event handler for edit and delete
    }
}

// Update the receiveed and sent notes count to the ui
function updateRecvdAndSentThanksCount(recvCnt, sentCnt) {
    recvNoteCntEl.textContent = recvCnt;
    sentNoteCntEl.textContent = sentCnt;
}

// ----- Functions to make api calls ----
// GET /api/user/:id to getch user id by pk
async function getUserData(loggedUserId) {
    try {
        const res = await fetch(`/api/user/${loggedUserId}`);
        const data = await res.json();
        const status = res.status;
        return data;

    } catch (err) {
        // TODO: Render error message in an alert box
        console.log("error: ", err)
    };
}

//GET /api/appreciation/received
async function getThanksRecvdByUser(loggedUserId) {
    try {
        const res = await fetch(`/api/appreciation/received/user/${loggedUserId}`);
        const data = await res.json();
        const status = res.status;
        return { status, data };

    } catch (err) {
        // TODO: Render error message in an alert box
        console.log("error: ", err)
    };
}

// GET /api/appreciation/seent
async function getThanksSentByUser(loggedUserId) {
    try {
        const res = await fetch(`/api/appreciation/sent/user/${loggedUserId}`);
        const data = await res.json();
        const status = res.status;
        return { status, data };

    } catch (err) {
        // TODO: Render error message in an alert box
        console.log("error: ", err)
    };
}


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

    // Validate inputs 
    if (rUser === "" || msg === "") {
        // if not all inputs display and alert msg
        return displayMsgInAlertContainer("Please fill all the fields in the form!", "danger");
    } else {
        // construct the note 
        const noteData = `<div class=\"h-50\" style=\"background-size: cover; background-position: center; background-image:linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),url('${selectedTemplateLink}')\">${msg}</div>`
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
                    receiver_id: 16, //TODO: remvoe
                    message: noteData
                })
            });

            if (response.ok) {
                displayMsgInAlertContainer("Note sent successfuly!", "info");
                clearFields();
            } else {
                const data = await response.json()
                displayMsgInAlertContainer("Failed to send note to user. Error: " + data, "info");
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

// Handle send thanks click event
function handleSendThanksClickEvent() {
    // TODO: 
    // Render form
    // Render thank you templates
    // Add event listener for form submit
    dataContainerEl.innerHTML = "";
    sendThanksContainerEl.style.display = "block";
    clearAlertMsgContainer();
    clearFields();
}

// Tasks to perform when the page loads
async function initWindowFunction() {
    const sessionData = await getSessionData();
    const loggedUserId = sessionData.user_id
    console.log("logged In user id: ", loggedUserId);

    // Initialize autoComplete
    // new autoComplete({
    //     selector: '#receiver',
    //     placeHolder: 'Type to search...',
    //     data: {
    //         src: async function (query) {
    //             try {
    //                 const response = await fetch(`api/user/`);
    //                 const data = await response.json();
    //                 console.log("AC: ", data);
    //                 return data; // Return the fetched data
    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //                 return []; // Return an empty array in case of error
    //             }
    //         },
    //        // key: ["firstName"], // Key to access the name in the returned data
    //         cache: false
    //     },
    //     resultsList: {
    //         // render: true,
    //         // container: (source) => {
    //         //     source.setAttribute("id", "autocomplete-results");
    //         // },
    //         // destination: document.querySelector("#receiver"),
    //         // position: "afterend"
    //         element: (list, data) => {
    //             console.log("results list: ", data)
    //             if (!data.results.length) {
    //                 // Create "No Results" message element
    //                 const message = document.createElement("div");
    //                 // Add class to the created element
    //                 message.setAttribute("class", "no_result");
    //                 // Add message text content
    //                 message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
    //                 // Append message element to the results list
    //                 list.prepend(message);
    //             }
    //         },
    //         noResults: true,
    //     },
    //     resultItem: {
    //         highlight: true,
    //         content: (data) => {
    //             const res = `<div class="autocomplete-suggestion">${data.value.firstName}</div>`;
    //             console.log("result: ", res);
    //             return (res);
    //         }
    //     },
    //     onSelection: (feedback) => {
    //         console.log("feedback: ", feedback);
    //         const selection = feedback.selection.value;
    //         console.log('Selected:', selection);
    //         document.querySelector('#receiver').value = selection.name; // Set the input value to the selected item
    //     }
    // });

    Promise.all([getUserData(loggedUserId), getThanksRecvdByUser(loggedUserId), getThanksSentByUser(loggedUserId)])
        .then(([userdataResponse, receivedResponse, sentResponse]) => {
            //render user data
            renderUserDetails(userdataResponse);

            const { status: receivedStatus, data: receivedData } = receivedResponse;
            const { status: sentStatus, data: sentData } = sentResponse;
            dataContainerEl.innerHTML = "";
            sendThanksContainerEl.style.display = "none";
            clearAlertMsgContainer();

            // Process received notes
            if (receivedStatus === 404) {
                displayMsgInAlertContainer("User has not received any Thank You notes!", 'info');
            } else {
                recvdNotesCnt = receivedData.length;
                renderReceiveNotesHTML(receivedData);
            }

            if (sentStatus !== 404) {
                sentNotesCnt = sentData.length;
            }

            // Log the total counts after both API calls have completed
            console.log(`Total sent notes: ${sentNotesCnt} and received notes: ${recvdNotesCnt}`);
            // Udpate total recvd and sent thanks count to html
            updateRecvdAndSentThanksCount(recvdNotesCnt, sentNotesCnt);

        })
        .catch((err) => console.error("Error in fetching received and sent notes data: ", err));
}

// Tasks to perform when the Received link is clicked
recvdNotesLinkEl.addEventListener("click", async () => {
    const sessionData = await getSessionData();
    const loggedUserId = sessionData.user_id
    console.log("logged In user id: ", loggedUserId);
    getThanksRecvdByUser(loggedUserId).then(({ status, data }) => {
        dataContainerEl.innerHTML = "";
        sendThanksContainerEl.style.display = "none";
        clearAlertMsgContainer();
        if (status === 404) {
            displayMsgInAlertContainer("User has not received any Thank You notes!", "info");
        } else {
            recvdNotesCnt = data.length;
            updateRecvdAndSentThanksCount(recvdNotesCnt, sentNotesCnt);
            renderReceiveNotesHTML(data);
        }
    });
});

// Tasks to perform when the Sent link is clicked
sentNotesLinkEl.addEventListener("click", async () => {
    const sessionData = await getSessionData();
    const loggedUserId = sessionData.user_id
    console.log("logged In user id: ", loggedUserId);
    getThanksSentByUser(loggedUserId).then(({ status, data }) => {
        dataContainerEl.innerHTML = "";
        sendThanksContainerEl.style.display = "none";
        clearAlertMsgContainer();
        if (status === 404) {
            displayMsgInAlertContainer("User has not sent any Thank You notes!", "info");
        } else {
            sentNotesCnt = data.length;
            renderSentNotesHTML(data);
            updateRecvdAndSentThanksCount(recvdNotesCnt, sentNotesCnt);
        }
    });
});

// Tasks to perform when the Send Thanks link is clicked
sendThanksLinkEL.addEventListener("click", handleSendThanksClickEvent);

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



window.onload = initWindowFunction;