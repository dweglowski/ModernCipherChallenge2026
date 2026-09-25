function updateAuthenticationControls() {
	var loginButton = document.getElementById("LoginButton");
	var userMenu = document.getElementById("UserMenu");
	var username = document.getElementById("Username");
	var sessionToken = sessionStorage.getItem("sessionToken");
	var usernameValue = sessionStorage.getItem("username");

	if (!loginButton || !userMenu || !username) {
		return;
	}

	var signedIn = Boolean(sessionToken && usernameValue);
	loginButton.hidden = signedIn;
	userMenu.hidden = !signedIn;

	if (signedIn) {
		username.textContent = usernameValue;
	}
}

function setupUserMenu() {
	var userMenu = document.getElementById("UserMenu");
	var username = document.getElementById("Username");
	var userDropdown = document.getElementById("UserDropdown");

	if (!userMenu || !username || !userDropdown) {
		return;
	}

	function closeUserMenu() {
		userDropdown.hidden = true;
		username.setAttribute("aria-expanded", "false");
	}

	username.addEventListener("click", function(event) {
		event.stopPropagation();
		var isOpen = !userDropdown.hidden;
		userDropdown.hidden = isOpen;
		username.setAttribute("aria-expanded", String(!isOpen));
	});

	document.addEventListener("click", function(event) {
		if (!userMenu.contains(event.target)) {
			closeUserMenu();
		}
	});

	document.addEventListener("keydown", function(event) {
		if (event.key === "Escape") {
			closeUserMenu();
		}
	});
}

updateAuthenticationControls();
setupUserMenu();
