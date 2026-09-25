async function signup() {
    hideError();
    var username = document.getElementById("username").value;
    var displayName = document.getElementById("displayname").value;
    var confirm_datastorage = document.getElementById("confirm_datastorage").checked;
    var confirm_rules = document.getElementById("confirm_rules").checked;

    // Simple client-side validation, the server also validates this but can save a round trip
    if (!confirm_datastorage || !confirm_rules) {
        showError("You must confirm that you accept the data storage and rules.");
        return;
    }
    if (username.length < 3 || username.length > 20 || !/^[A-Za-z0-9_]+$/.test(username)) {
        showError("Username must be 3-20 characters and contain only letters, numbers and underscores.");
        return;
    }
    if (displayName.length < 1 || displayName.length > 40) {
        showError("Display name must be between 1 and 40 characters.");
        return;
    }


    // Send the signup request to the server
    try {
        const response = await fetch(
            "https://mcc2026leaderboard.cipherchallengekeymaster.workers.dev/auth/signup",
            {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                username,
                displayName,
            }),
            }
        );

        // If the request fails, display the server's error when available.
        const data = await response.json();
        if (!response.ok) {
            showError(data.error || "Network Error");
            return;
        }

        // Keep the session for this browser tab.
        sessionStorage.setItem(
            "sessionToken",
            data.sessionToken
        );
        sessionStorage.setItem("username", username);

        // Show the PIN to the user
        document.getElementById("Step1").hidden = true;
        document.getElementById("Step2").hidden = false;
        document.getElementById("PIN").textContent = data.pin;
    } catch (error) {
        showError("Network Error");
    }
    return;

}

function hideError() {
    var errorElement = document.getElementById("SignupError");
    errorElement.style.visibility = "hidden";
}

function showError(message) {
    var errorElement = document.getElementById("SignupError");
    errorElement.textContent = message;
    errorElement.style.visibility = "visible";
}

function setupSignupForm() {
    var form = document.querySelector("#SignupForm form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        signup();
    });
}
setupSignupForm();