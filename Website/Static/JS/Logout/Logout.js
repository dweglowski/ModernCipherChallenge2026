async function logout() {
    // Send the logout request to the server
    try {
        await apiFetch("/auth/logout", {
            method: "POST",
        });
    } catch (error) {
        console.error(error);
    }
    finally {
        // Clear the session storage
        sessionStorage.removeItem("sessionToken");
        sessionStorage.removeItem("username");
    }
    document.getElementById("Step1").hidden = true;
    document.getElementById("Step2").hidden = false;
    return;

}

logout();