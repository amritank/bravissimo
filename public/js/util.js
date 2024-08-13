function displayMsgInAlertContainer(msg, msgType) {
    alertMsgEl.display = "block";
    alertMsgEl.textContent = msg;
    if (msgType === "info") {
        alertMsgEl.classList.add("alert", "alert-primary", "mb-1");
    } else {
        alertMsgEl.classList.add("alert", "alert-danger", "mb-1");
    }
}


function clearAlertMsgContainer() {
    alertMsgEl.textContent = ""
    alertMsgEl.display = "none";
    alertMsgEl.classList.remove("alert-primary");
    alertMsgEl.classList.remove("alert-danger");
    alertMsgEl.classList.remove("alert");
    alertMsgEl.classList.remove("mb-5");
}