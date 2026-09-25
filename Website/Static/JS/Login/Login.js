async function login() {
    hideError();
    var username = document.getElementById("username").value;
    var pin = document.getElementById("PIN").value;

    // Send the login request to the server
    try {
        const response = await fetch(
            "https://mcc2026leaderboard.cipherchallengekeymaster.workers.dev/auth/login",
            {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                username,
                pin,
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
        sessionStorage.setItem("username", data.user.username || username);

        // Show the display name to the user
        document.getElementById("Step1").hidden = true;
        document.getElementById("Step2").hidden = false;
        document.getElementById("UsernameDisplay").textContent = data.user.displayName;
    } catch (error) {
        showError("Network Error");
    }
    return;

}

function hideError() {
    var errorElement = document.getElementById("LoginError");
    errorElement.style.visibility = "hidden";
}

function showError(message) {
    var errorElement = document.getElementById("LoginError");
    errorElement.textContent = message;
    errorElement.style.visibility = "visible";
}


function setupLoginForm() {
    var form = document.querySelector("#LoginForm form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        login();
    });
}
setupLoginForm();