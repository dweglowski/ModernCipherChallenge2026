async function deleteMyData() {
    document.getElementById("DeleteDataButton").textContent = "Deleting data, please wait...";
    document.getElementById("DeleteDataButton").disabled = true;
    // Send a data deletion request to the server
    try {
        await apiFetch("/auth/delete", {
            method: "POST",
        });
        sessionStorage.removeItem("sessionToken");
        sessionStorage.removeItem("username");
        document.getElementById("Step1").hidden = true;
        document.getElementById("Step2").hidden = false;
    } catch (error) {
        alert("An error occured while trying to delete your data. Please try logging out and logging back in, then try again. If the problem persists, create a github issue at https://github.com/dweglowski/ModernCipherChallenge2026/issues.");
        console.error(error);
    }
    return;

}

async function fillUsernameDisplay() {
    // Request active user information from the server
    try {
        await apiFetch("/auth/me", {
            method: "GET",
        });
        const usernameValue = sessionStorage.getItem("username");
        if (!usernameValue) {
            throw new Error("No username found in session storage.");
        }
        document.getElementById("UsernameDisplay").textContent = usernameValue;
    } catch (error) {
        document.getElementById("UsernameDisplay").innerHTML = '<p style="color: red">Error: Please make sure you are logged into the account you want to delete.</p>';
        return;
    }
    return;

}

fillUsernameDisplay();