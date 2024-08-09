const recvNotesEle = document.getElementById("recvdNotesLink");
const dataContainerEl = document.getElementById("dataContainer");
const recvNoteCntEl = document.getElementById("recvdNotes");
const sentNoteCntEl = document.getElementById("sentNotes");
const recvdNotesLink = document.getElementById("recvdNotesLink");
const sentNotesLink = document.getElementById("sentNotesLink");
const sendThanksLink = document.getElementById("sendThanksLink");


// ----- Helper functions -----
function renderUserDetails(userData) {
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


// ----- Functions to render html  ----
function render404Html(message) {
    const pEl = document.createElement("p");
    pEl.innerHTML = message;
    dataContainerEl.appendChild(pEl);
}

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

function renderSentNotesHTML(data) {
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

function updateRecvdAndSentThanksCount(recvCnt, sentCnt) {
    recvNoteCntEl.textContent = recvCnt;
    sentNoteCntEl.textContent = sentCnt;
}

// ----- Functions to make api calls ----
// GET /api/user/:id to getch user id by pk
function getUserData() {
    // TODO: <need Annamaris's changes> query api to get user detail
    return {
        firstName: "amrita",
        lastName: "Nair",
        profileImg: "https://picsum.photos/200/300"
    };
}

async function getThanksRecvdByUser() {
    try {
        //TODO: fetch user id from session
        const res = await fetch("/api/appreciation/received/user/1");
        const data = await res.json();
        const status = res.status;
        return { status, data };

    } catch (err) {
        // TODO: Render error message in an alert box
        console.log("error: ", err)
    };
}

async function getThanksSentByUser() {
    try {
        //TODO: fetch user id from session
        const res = await fetch("/api/appreciation/sent/user/1");
        const data = await res.json();
        const status = res.status;
        return { status, data };

    } catch (err) {
        // TODO: Render error message in an alert box
        console.log("error: ", err)
    };
}


// ----- Event  listeners----

// Tasks to perform when the page loads
function initWindowFunction() {
    // get user data
    const userData = getUserData();
    // render profile image, first name into the html page
    renderUserDetails(userData);

    Promise.all([getThanksRecvdByUser(), getThanksSentByUser()])
        .then(([receivedResponse, sentResponse]) => {
            const { status: receivedStatus, data: receivedData } = receivedResponse;
            const { status: sentStatus, data: sentData } = sentResponse;
            dataContainerEl.innerHTML = "";
            let recvdNotesCnt = 0;
            let sentNotesCnt = 0;

            // Process received notes
            if (receivedStatus === 404) {
                render404Html("User has not received any <b>Thank You</b> notes!");
            } else {
                recvdNotesCnt = receivedData.length;
                renderReceiveNotesHTML(receivedData);
            }

            if (sentData) {
                sentNotesCnt = sentData.length;
            }

            // Log the total counts after both API calls have completed
            console.log(`Total sent notes: ${sentNotesCnt} and received notes: ${recvdNotesCnt}`);
            // Udpate total recvd and sent thanks count to html
            updateRecvdAndSentThanksCount(recvdNotesCnt, sentNotesCnt);

        })
        .catch((err) => console.error("Error in fetching received and sent notes data: ", err));
}

recvdNotesLink.addEventListener("click", () => {
    getThanksRecvdByUser().then(({ status, data }) => {
        dataContainerEl.innerHTML = "";
        if (status === 404) {
            render404Html("User has not received any <b>Thank You</b> notes!");
        } else {

            renderReceiveNotesHTML(data);
        }
    });
});

sentNotesLink.addEventListener("click", () => {
    getThanksSentByUser().then(({ status, data }) => {
        dataContainerEl.innerHTML = "";
        if (status === 404) {
            render404Html("User has not sent any <b>Thank You</b> notes!");
        } else {
            renderSentNotesHTML(data);
        }
    });
});

window.onload = initWindowFunction;