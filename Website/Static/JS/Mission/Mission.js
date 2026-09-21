const testing_url = "https://raw.githubusercontent.com/dweglowski/ModernCipherChallenge2026/refs/heads/main/WebsiteData";
// const testing_url = "http://127.0.0.1:8000";



// Case Files
const ShowCaseFilesButton = document.getElementById("ShowCaseFilesButton");
const HideCaseFilesButton = document.getElementById("HideCaseFilesButton");
const CaseFilesList = document.getElementById("CaseFilesList");

ShowCaseFilesButton.addEventListener("click", () => {
    CaseFilesList.setAttribute("visible", "");
    HideCaseFilesButton.setAttribute("visible", "");
    ShowCaseFilesButton.removeAttribute("visible");
});

HideCaseFilesButton.addEventListener("click", () => {
    CaseFilesList.removeAttribute("visible");
    HideCaseFilesButton.removeAttribute("visible");
    ShowCaseFilesButton.setAttribute("visible", "");
});

// Hints section
const ShowHintsButton = document.getElementById("ShowHintsButton");
const HideHintsButton = document.getElementById("HideHintsButton");
const HintList = document.getElementById("HintList");

ShowHintsButton.addEventListener("click", () => {
    HintList.setAttribute("visible", "");
    HideHintsButton.setAttribute("visible", "");
    ShowHintsButton.removeAttribute("visible");
});

HideHintsButton.addEventListener("click", () => {
    HintList.removeAttribute("visible");
    HideHintsButton.removeAttribute("visible");
    ShowHintsButton.setAttribute("visible", "");
});

// Official decrypt (only displays after the challenge has finished, otherwise just shows a placeholder)
const ShowSolutionButton = document.getElementById("ShowSolutionButton");
const SolutionText = document.getElementById("SolutionText");

ShowSolutionButton.addEventListener("click", () => {
    SolutionText.setAttribute("visible", "");
    ShowSolutionButton.setAttribute("disabled", "");
});








// Get the current mission number from the URL
const urlParams = new URLSearchParams(window.location.search);
const requestedMission = urlParams.get("mission");
let missionNumber;
if (/^(?:[0-9]|10)$/.test(requestedMission ?? "")) { // change back after testing mission 0 is done
    missionNumber = Number(requestedMission);
} else {
    missionNumber = 1;
}
document.getElementById("MissionNumber").textContent = missionNumber;


// Check if the challenge is available or completed yet
async function getMissionSchedule() {
    try {
        const response = await fetch(`${testing_url}/MissionSchedule.json`);
        if (!response.ok) {
            return "Error fetching ciphertext. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching ciphertext. Please try again later.";
    }
}
async function checkMissionAvailability() {
    const schedule = await getMissionSchedule();
    if (schedule === "Error fetching ciphertext. Please try again later.") {
        console.error(schedule);
        return;
    }

    const missionSchedule = JSON.parse(schedule);
    const missionInfo = missionSchedule[`mission_${missionNumber}`];

    if (!missionInfo) {
        console.error("Mission information not found.");
        return;
    }

    // Load the title
    document.getElementById("ChallengeTitle").textContent = missionInfo.title;

    const currentTime = new Date();
    const startTime = new Date(missionInfo.start_time);
    const endTime = new Date(missionInfo.end_time);

    if (currentTime < startTime) {
        return "Not available yet";
    } else if (currentTime > endTime) {
        return "Mission completed";
    } else {
        return "Mission active";
    }
}




// Load ciphertext
async function fetchCiphertext(missionNumber) {
    try {
        const response = await fetch(`${testing_url}/Missions/${missionNumber}/Ciphertext.txt`);
        if (!response.ok) {
            return "Error fetching ciphertext. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching ciphertext. Please try again later.";
    }
}

async function loadCiphertext(missionNumber, is_live = true) {
    // try get ciphertext from local storage first if possible
    if (localStorage.getItem(`ciphertext_mission_${missionNumber}`)) {
        const cachedCiphertext = localStorage.getItem(`ciphertext_mission_${missionNumber}`);
        document.getElementById("Ciphertext").textContent = cachedCiphertext;
        return;
    }
    const ciphertext = await fetchCiphertext(missionNumber);
    if (ciphertext === "Error fetching ciphertext. Please try again later.") {
        console.error(ciphertext);
        return;
    }
    // Save to local storage for future use
    localStorage.setItem(`ciphertext_mission_${missionNumber}`, ciphertext);

    document.getElementById("Ciphertext").textContent = ciphertext;

    // If live, update analytics
    if (is_live) {
        // Send a POST request to the analytics endpoint
        analyticsMissionView(missionNumber);
    }
}


// Load plaintext (only works after the challenge has finished, otherwise the plaintext would not be available on the server)
async function fetchPlaintext(missionNumber) {
    try {
        const response = await fetch(`${testing_url}/Missions/${missionNumber}/Plaintext.txt`);
        if (!response.ok) {
            return "Error fetching plaintext. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching plaintext. Please try again later.";
    }
}

async function loadPlaintext(missionNumber) {
    const plaintext = await fetchPlaintext(missionNumber);
    if (plaintext === "Error fetching plaintext. Please try again later.") {
        console.error(plaintext);
        return;
    }
    document.getElementById("SolutionText").textContent = plaintext;
}

// Load the solution hash for local submission verification
async function fetchSolutionHash(missionNumber) {
    try {
        const response = await fetch(`${testing_url}/Missions/${missionNumber}/SolutionHash.txt`);
        if (!response.ok) {
            return "Error fetching solution hash. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching solution hash. Please try again later.";
    }
}

async function hashSolution(str) {
    const cleanedInput = str.replace(/[^a-zA-Z]/g, '').toLowerCase();

    // Hash the cleaned input using SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanedInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function submitLocal(missionNumber) {
    const userInput = document.getElementById("SubmitLocalInput").value.trim();
    if (!userInput) {
        document.getElementById("SubmitLocalFeedbackIncorrect").setAttribute("visible", "");
        document.getElementById("SubmitLocalFeedbackCorrect").removeAttribute("visible");
        return;
    }
    document.getElementById("SubmitLocalFeedbackCorrect").removeAttribute("visible");
    document.getElementById("SubmitLocalFeedbackIncorrect").removeAttribute("visible");

    // Dissable the submit button while processing
    document.getElementById("SubmitLocalButton").setAttribute("disabled", "");
    document.getElementById("SubmitLocalButton").textContent = "Checking...";
    
    const solutionHash = await fetchSolutionHash(missionNumber);
    if (solutionHash === "Error fetching solution hash. Please try again later.") {
        console.error(solutionHash);
        document.getElementById("SubmitLocalFeedbackIncorrect").setAttribute("visible", "");
        document.getElementById("SubmitLocalFeedbackCorrect").removeAttribute("visible");
        document.getElementById("SubmitLocalButton").removeAttribute("disabled");
        document.getElementById("SubmitLocalButton").textContent = "Submit Solution";
        return;
    }

    analyticsSubmission(missionNumber);

    const hashHex = await hashSolution(userInput);

    if (hashHex === solutionHash) {
        document.getElementById("SubmitLocalFeedbackCorrect").setAttribute("visible", "");
        document.getElementById("SubmitLocalFeedbackIncorrect").removeAttribute("visible");
        document.getElementById("SubmitLocalButton").setAttribute("disabled", "");
        document.getElementById("SubmitLocalButton").style.display = "none";
        document.getElementById("SubmitLocalButton").textContent = "Correct!";
        analyticsSubmissionCorrect(missionNumber);
    } else {
        document.getElementById("SubmitLocalFeedbackIncorrect").setAttribute("visible", "");
        document.getElementById("SubmitLocalFeedbackCorrect").removeAttribute("visible");
        // Re-enable the submit button
        document.getElementById("SubmitLocalButton").removeAttribute("disabled");
        document.getElementById("SubmitLocalButton").textContent = "Submit Solution";
    }


}



// Load Hints
async function fetchHintsSchedule(missionNumber) {
    try {
        const response = await fetch(`${testing_url}/Missions/${missionNumber}/HintsSchedule.json`);
        if (!response.ok) {
            return "Error fetching hints. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching hints. Please try again later.";
    }
}

async function loadHints(missionNumber) {
    const hintsSchedule = await fetchHintsSchedule(missionNumber);
    if (hintsSchedule === "Error fetching hints. Please try again later.") {
        console.error(hintsSchedule);
        return;
    }

    const hintsData = JSON.parse(hintsSchedule);
    const currentTime = new Date();

    // Use the first hint in the html as a template for the rest of the hints
    const hintTemplate = document.getElementById("HintTemplate");

    for (const hint of hintsData.hints) {
        // Clone the hint template and set its ID and content
        const newHint = hintTemplate.cloneNode(true);
        newHint.id = `Hint${hint.number}`;
        newHint.querySelector("p").textContent = `Hint ${hint.number}`;
        newHint.querySelector(".TimeRemainingText .TimeRemaining").textContent = "Calculating...";
        // Append the new hint to the hint list
        document.getElementById("HintList").appendChild(newHint);

        const hintElement = document.getElementById(`Hint${hint.number}`);
        const hintButton = hintElement.querySelector(".ShowHintButton");
        const hideHintButton = hintElement.querySelector(".HideHintButton");
        const timeRemainingText = hintElement.querySelector(".TimeRemainingText");
        const timeRemainingSpan = timeRemainingText.querySelector(".TimeRemaining");

        const startTime = new Date(hint.start_time);

        if (currentTime < startTime) {
            // Hint not available yet
            hintButton.setAttribute("disabled", "");
            timeRemainingText.setAttribute("visible", "");
            const timeDiff = startTime - currentTime;
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            timeRemainingSpan.textContent = `${days}d ${hours}h ${minutes}m`;
            if (days === 0 && hours === 0 && minutes === 0) {
                // Less than 1m left, show 0d 0h 1m
                timeRemainingSpan.textContent = `0d 0h 1m`;
            }

            // Update the countdown every minute
            updateHintCountdown(hintElement, startTime, hint.number);
            
        } else {
            // Hint available
            hintButton.removeAttribute("disabled");
            timeRemainingText.removeAttribute("visible");
            loadHintContent(missionNumber, hint.number);
            
            hintButton.addEventListener("click", () => {
                const hintContent = hintElement.querySelector(".HintContent");
                hintContent.setAttribute("visible", "");
                hintButton.removeAttribute("visible");
                hideHintButton.setAttribute("visible", "");
            });
            
            hideHintButton.addEventListener("click", () => {
                const hintContent = hintElement.querySelector(".HintContent");
                hintContent.removeAttribute("visible");
                hideHintButton.removeAttribute("visible");
                hintButton.setAttribute("visible", "");
            });
        }
    }
}

function updateHintCountdown(hintElement, startTime, hintNumber) {
    const timeRemainingSpan = hintElement.querySelector(".TimeRemaining");
    const updateCountdown = () => {
        const currentTime = new Date();
        const timeDiff = startTime - currentTime;
        if (timeDiff <= 0) {
            clearInterval(countdownInterval);
            timeRemainingSpan.textContent = "0d 0h 0m";

            // Load the hint content and enable the button
            loadHintContent(missionNumber, hintNumber);
            const hintButton = hintElement.querySelector(".ShowHintButton");
            hintButton.removeAttribute("disabled");
            const timeRemainingText = hintElement.querySelector(".TimeRemainingText");
            timeRemainingText.removeAttribute("visible");

            const hideHintButton = hintElement.querySelector(".HideHintButton");
            const hintContent = hintElement.querySelector(".HintContent");
            hintButton.addEventListener("click", () => {
                const hintContent = hintElement.querySelector(".HintContent");
                hintContent.setAttribute("visible", "");
                hintButton.removeAttribute("visible");
                hideHintButton.setAttribute("visible", "");
            });
            
            hideHintButton.addEventListener("click", () => {
                const hintContent = hintElement.querySelector(".HintContent");
                hintContent.removeAttribute("visible");
                hideHintButton.removeAttribute("visible");
                hintButton.setAttribute("visible", "");
            });


            return;
        }
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        timeRemainingSpan.textContent = `${days}d ${hours}h ${minutes}m`;
        if (days === 0 && hours === 0 && minutes === 0) {
            // Less than 1m left, show 0d 0h 1m
            timeRemainingSpan.textContent = `0d 0h 1m`;
        }
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 20000); // Update every 20s
}

async function fetchHintContent(missionNumber, hintNumber) {
    try {
        const response = await fetch(`${testing_url}/Missions/${missionNumber}/Hints/${hintNumber}.txt`);
        if (!response.ok) {
            return "Error fetching hint content. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching hint content. Please try again later.";
    }
}

async function loadHintContent(missionNumber, hintNumber) {
    const hintContent = await fetchHintContent(missionNumber, hintNumber);
    if (hintContent === "Error fetching hint content. Please try again later.") {
        console.error(hintContent);
        return;
    }

    const hintElement = document.getElementById(`Hint${hintNumber}`);
    const hintContentElement = hintElement.querySelector(".HintContent");
    
    const lines = hintContent.split('\n');
    let codeBlock = null;

    for (const line of lines) {
        if (line.startsWith('<code>')) {
            codeBlock = document.createElement('code');
            codeBlock.textContent = "";
            continue;
        }

        if (line.endsWith('</code>') && codeBlock) {
            hintContentElement.appendChild(codeBlock);
            codeBlock = null;
            continue;
        }

        if (codeBlock) {
            codeBlock.textContent += line + '\n';
        } else {
            const p = document.createElement('p');
            p.textContent = line;
            hintContentElement.appendChild(p);
        }
    }
}




// Load Case files

async function fetchCaseFiles(missionNumber) {
    try {
        const response = await fetch(`${testing_url}/Missions/${missionNumber}/CaseFiles.txt`);
        if (!response.ok) {
            return "Error fetching case files. Please try again later.";
        }
        const data = await response.text();
        return data;
    } catch (error) {
        return "Error fetching case files. Please try again later.";
    }
}

async function loadCaseFiles(missionNumber) {
    const caseFiles = await fetchCaseFiles(missionNumber);
    if (caseFiles === "Error fetching case files. Please try again later.") {
        console.error(caseFiles);
        return;
    }

    const caseFilesListElement = document.getElementById("CaseFilesList");

    // Clear existing case files
    caseFilesListElement.innerHTML = "";

    const lines = caseFiles.split('\n');
    let codeBlock = null;

    for (const line of lines) {
        if (line.startsWith('<code>')) {
            codeBlock = document.createElement('code');
            codeBlock.textContent = "";
            continue;
        }

        if (line.endsWith('</code>') && codeBlock) {
            caseFilesListElement.appendChild(codeBlock);
            codeBlock = null;
            continue;
        }

        if (codeBlock) {
            codeBlock.textContent += line + '\n';
        } else {
            if (line.trim() === "") {
                const br = document.createElement('br');
                caseFilesListElement.appendChild(br);
                continue;
            }
            const p = document.createElement('p');
            p.textContent = line;
            caseFilesListElement.appendChild(p);
        }
    }
}


// Simple anonymous analytics to help me understand how the challenge is being used.
// Stores only an anonymous total count of views, submissions, and correct submissions for each mission.
// No personal data is stored or tracked.
async function analyticsMissionView(missionNumber) {
    try {
        const response = await fetch(`https://mcc2026analytics.cipherchallengekeymaster.workers.dev/analytics/mission_view/${missionNumber}`, { method: 'POST' });
    } catch (error) {
        return;
    }
}
async function analyticsSubmission(missionNumber) {
    try {
        const response = await fetch(`https://mcc2026analytics.cipherchallengekeymaster.workers.dev/analytics/submission/${missionNumber}`, { method: 'POST' });
    } catch (error) {
        return;
    }
}
async function analyticsSubmissionCorrect(missionNumber) {
    try {
        const response = await fetch(`https://mcc2026analytics.cipherchallengekeymaster.workers.dev/analytics/correct_submission/${missionNumber}`, { method: 'POST' });
    } catch (error) {
        return;
    }
}






// Check if the user is logged in
async function checkLoginStatus() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const loggedInCookie = cookies.find(cookie => cookie.startsWith('logged_in='));
    if (!loggedInCookie) {
        return false;
    }
    const loggedInValue = loggedInCookie.split('=')[1];
    return loggedInValue === 'true';
}










// Startup
async function initializeMission() {
    const availabilityStatus = await checkMissionAvailability();
    if (availabilityStatus === "Mission completed") {
        loadCiphertext(missionNumber, live = false);
        loadHints(missionNumber);
        loadPlaintext(missionNumber);
        loadCaseFiles(missionNumber);
        
        // hide submission form
        document.getElementById("SubmitLocalContainer").style.display = "none";
        // document.getElementById("SubmitContainer").style.display = "none";
        // Show the official solution
        document.getElementById("SolutionContainer").setAttribute("visible", "");
        
        return;
    }
    else if (availabilityStatus === "Mission active") {
        loadCiphertext(missionNumber);
        loadCaseFiles(missionNumber);
        loadHints(missionNumber);

        
        // Bind the local submission button
        const localSubmitButton = document.getElementById("SubmitLocalButton");
        localSubmitButton.addEventListener("click", () => {
            submitLocal(missionNumber);
        });
        return;
    }
    else {
        document.getElementById("Ciphertext").textContent = "This mission is not available yet. Please check back later.";
        // document.getElementById("Ciphertext").style.color = "red";
        document.getElementById("Ciphertext").style.fontWeight = "bold";

        // Hide the hints and case files sections
        document.getElementById("HintContainer").style.display = "none";
        document.getElementById("CaseFilesContainer").style.display = "none";
        // Hide the submission form
        document.getElementById("SubmitLocalContainer").style.display = "none";
        // document.getElementById("SubmitContainer").style.display = "none";

        return;
    }



    // If logged in, hide local submission form and show the main submission form
    // const isLoggedIn = await checkLoginStatus();
    // if (isLoggedIn) {
    //     document.getElementById("SubmitLocalContainer").removeAttribute("visible");
    //     document.getElementById("SubmitContainer").setAttribute("visible", "");
    // } else {
    //     document.getElementById("SubmitLocalContainer").setAttribute("visible", "");
    //     document.getElementById("SubmitContainer").removeAttribute("visible");
    // }
}


initializeMission();