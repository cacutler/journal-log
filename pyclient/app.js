var journalEntryDate = document.querySelector("#journal-entry-date");
var journalEntry = document.querySelector("#journal-entry");
var author = document.querySelector("#entry-author");
var mood = document.querySelector("#mood");
var mood_scale = document.querySelector("#mood-scale");
var addEntryButton = document.querySelector("#add-entry-button");
console.log("add entry button", addEntryButton);
addEntryButton.onclick = function () {
    console.log("add entry button was clicked");
    var data = "date=" + encodeURIComponent(journalEntryDate.value);
    data += "&entry=" + encodeURIComponent(journalEntry.value);
    data += "&author=" + encodeURIComponent(author.value);
    data += "&mood=" + encodeURIComponent(mood.value);
    data += "&mood_scale=" + encodeURIComponent(mood_scale.value);
    console.log("user typed:", journalEntryDate.value);
    console.log("user typed:", journalEntry.value);
    console.log("user typed:", author.value);
    console.log("user typed:", mood.value);
    console.log("user typed:", mood_scale.value);
    console.log("data", data);
    console.log("journal entry to be sent to server", data);
    fetch("http://localhost:8080/journal_entries", {
        credentials: "include",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        console.log("journal entry was sent to server");
        loadDataFromServer();
    });
};
function deleteDataFromServer(id) {
    fetch(`http://localhost:8080/journal_entries/${id}`, {
        credentials: "include",
        method: "DELETE"
    }).then(function (response) {
        console.log("journal entry was deleted from server");
        loadDataFromServer();
    });
};
function editDataFromServer(id) {
    fetch(`http://localhost:8080/journal_entries/${id}`, {
        credentials: "include"
    }).then(function (response) {
        console.log("Editing entry", id);
        response.json().then(function (data) {
            console.log("Entry data", data);
            journalEntryDate.value = data.date;
            journalEntry.value = data.entry;
            author.value = data.author;
            mood.value = data.mood;
            mood_scale.value = data.mood_scale;
        });
    });
};
function confirmUpdatedEntry(id) {
    var data = "date=" + encodeURIComponent(journalEntryDate.value);
    data += "&entry=" + encodeURIComponent(journalEntry.value);
    data += "&author=" + encodeURIComponent(author.value);
    data += "&mood=" + encodeURIComponent(mood.value);
    data += "&mood_scale=" + encodeURIComponent(mood_scale.value);
    console.log("user typed:", journalEntryDate.value);
    console.log("user typed:", journalEntry.value);
    console.log("user typed:", author.value);
    console.log("user typed:", mood.value);
    console.log("user typed:", mood_scale.value);
    console.log("data", data);
    console.log("journal entry to be sent to server for update", data);
    fetch(`http://localhost:8080/journal_entries/${id}`, {
        credentials: "include",
        method: "PUT",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        console.log("journal entry was sent to server for update");
        journalEntryDate.value = "";
        journalEntry.value = "";
        author.value = "";
        mood.value = "";
        mood_scale.value = "";
        loadDataFromServer();
    });
};
function loadDataFromServer() {
    fetch("http://localhost:8080/journal_entries", {
        credentials: "include"
    }).then(function (response1) {
        var log_in_screen = document.querySelector("#modal-login");
        var log_in_email = document.querySelector("#log-in-email");
        var log_in_password = document.querySelector("#log-in-password");
        var log_in_button = document.querySelector("#log-in-button");
        var sign_up_button = document.querySelector("#sign-up-button");
        var register_screen = document.querySelector("#modal-register");
        var first_name = document.querySelector("#first-name");
        var last_name = document.querySelector("#last-name");
        var register_email = document.querySelector("#register-email");
        var create_account_button = document.querySelector("#create-account-button");
        var sign_in_button = document.querySelector("#sign-in-button");
        var register_password = document.querySelector("#register-password");
        var logged_in_screen = document.querySelector("#modal-logged-in");
        var registration_message = document.querySelector("#registration-response-message");
        var log_in_message = document.querySelector("#log-in-response-message");
        var log_out_button = document.querySelector("#log-out-button");
        var log_out_message = document.querySelector("#log-out-message");
        if (response1.status == 401) {
            logged_in_screen.style.display = "none";
            register_screen.style.display = "none";
            log_in_screen.style.display = "block";
            sign_up_button.onclick = function () {
                console.log("sign up button was clicked");
                log_in_screen.style.display = "none";
                register_screen.style.display = "block";
            };
            sign_in_button.onclick = function () {
                console.log("sign in button was clicked");
                register_screen.style.display = "none";
                log_in_screen.style.display = "block";
            };
            create_account_button.onclick = function () {
                console.log("create account button was clicked");
                log_in_screen.style.display = "none";
                register_screen.style.display = "block";
                var data = "first_name=" + encodeURIComponent(first_name.value);
                data += "&last_name=" + encodeURIComponent(last_name.value);
                data += "&email=" + encodeURIComponent(register_email.value);
                data += "&password=" + encodeURIComponent(register_password.value);
                console.log("user typed:", first_name.value);
                console.log("user typed:", last_name.value);
                console.log("user typed:", register_email.value);
                console.log("user typed:", register_password.value);
                console.log("data", data);
                console.log("user to be created on server", data);
                fetch("http://localhost:8080/users", {
                    credentials: "include",
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (response2) {
                    console.log("user information was sent to server.");
                    if (response2.status == 201) {
                        console.log("user was created");
                        first_name.value = "";
                        last_name.value = "";
                        register_email.value = "";
                        register_password.value = "";
                        registration_message.innerHTML = "Success.  User was created.";
                    } else if (response2.status == 409) {
                        console.log("user creation failed");
                        first_name.value = "";
                        last_name.value = "";
                        register_email.value = "";
                        register_password.value = "";
                        registration_message.innerHTML = "Failure.  User already exists.";
                    }
                });
            };
            log_in_button.onclick = function () {
                console.log("log in button was clicked");
                var data = "email=" + encodeURIComponent(log_in_email.value);
                data += "&password=" + encodeURIComponent(log_in_password.value);
                console.log("user typed:", log_in_email.value);
                console.log("user typed:", log_in_password.value);
                console.log("data", data);
                console.log("user to be logged in on server", data);
                fetch("http://localhost:8080/sessions", {
                    credentials: "include",
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (response3) {
                    console.log("user login information was sent to server and user was logged in.");
                    if (response3.status == 201) {
                        console.log("login was successful");
                        log_in_email.value = "";
                        log_in_password.value = "";
                        log_in_message.innerHTML = "Success.";
                        loadDataFromServer();
                    } else if (response3.status == 401) {
                        console.log("login failed");
                        log_in_email.value = "";
                        log_in_password.value = "";
                        log_in_message.innerHTML = "Invalid Email and Password.";
                    }
                });
            };
        } else if (response1.status == 200) {
            log_in_screen.style.display = "none";
            register_screen.style.display = "none";
            logged_in_screen.style.display = "block";
            log_out_button.onclick = function () {
                console.log("logging out");
                fetch(`http://localhost:8080/sessions`, {
                    credentials: "include",
                    method: "DELETE"
                }).then(function (response4) {
                    console.log("user logged out");
                    log_out_message.innerHTML = "Goodbye.";
                    loadDataFromServer();
                });
            };
            console.log("response received");
            response1.json().then(function (data) {
                console.log("response data", data);
                journal_entries = data;
                var entriesList = document.querySelector("#entries-list");
                entriesList.innerHTML = "";
                journal_entries.forEach(function (entry) {
                    var newListItem = document.createElement("li");
                    var dateDiv = document.createElement("div");
                    dateDiv.innerHTML = entry.date;
                    dateDiv.classList.add("date");
                    newListItem.appendChild(dateDiv);
                    var authorDiv = document.createElement("div");
                    authorDiv.innerHTML = "Author of Entry: " + entry.author;
                    authorDiv.classList.add("author");
                    newListItem.appendChild(authorDiv);
                    var moodDiv = document.createElement("div");
                    moodDiv.innerHTML = "Mood was " + entry.mood;
                    moodDiv.classList.add("mood");
                    newListItem.appendChild(moodDiv);
                    var moodScaleDiv = document.createElement("div");
                    moodScaleDiv.innerHTML = "Mood scale was at " + entry.mood_scale;
                    moodScaleDiv.classList.add("mood-scale");
                    newListItem.appendChild(moodScaleDiv);
                    var entryDiv = document.createElement("div");
                    entryDiv.innerHTML = entry.entry;
                    entryDiv.classList.add("entry");
                    newListItem.appendChild(entryDiv);
                    var deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "Delete";
                    deleteButton.onclick = function () {
                        console.log("Delete entry", entry.id);
                        if (window.confirm("Do you want to delete this entry?")){
                            deleteDataFromServer(entry.id);
                        }
                    };
                    newListItem.appendChild(deleteButton);
                    var editButton = document.createElement("button");
                    editButton.innerHTML = "Edit";
                    editButton.onclick = function () {
                        console.log("Edit entry", entry.id);
                        editDataFromServer(entry.id);
                    };
                    newListItem.appendChild(editButton);
                    var confirmButton = document.createElement("button");
                    confirmButton.innerHTML = "Update";
                    confirmButton.onclick = function() {
                        console.log("Update new entry", entry.id);
                        confirmUpdatedEntry(entry.id);
                    };
                    newListItem.appendChild(confirmButton);
                    entriesList.appendChild(newListItem);
                });
            });
        }
    });
};
loadDataFromServer();