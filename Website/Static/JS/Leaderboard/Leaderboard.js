
// ============================================================
// LEADERBOARD CLIENT
// ============================================================


const LEADERBOARD_API_URL =
  "https://mcc2026leaderboard.cipherchallengekeymaster.workers.dev/leaderboard";


// ============================================================
// DOM ELEMENTS
// ============================================================

const leaderboardSelect =
  document.getElementById("leaderboard-select");

const leaderboardBody =
  document.getElementById("leaderboard-body");

const leaderboardStatus =
  document.getElementById("leaderboard-status");


// Used to prevent an older request from overwriting
// a newer request when the dropdown is changed quickly.

let leaderboardRequestId = 0;


// ============================================================
// FETCH LEADERBOARD DATA
// ============================================================

async function fetchLeaderboard(url) {

  const response = await fetch(url, {
    method: "GET",

    headers: {
      "Accept": "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to load leaderboard."
    );
  }

  return data;
}


// ============================================================
// POPULATE DROPDOWN
// ============================================================

function populateLeaderboardDropdown(options) {

  // Remove existing options safely.
  leaderboardSelect.replaceChildren();

  for (const item of options) {

    if (
      typeof item.value !== "string" ||
      typeof item.label !== "string"
    ) {
      continue;
    }

    const option = document.createElement("option");

    option.value = item.value;

    // IMPORTANT:
    // Never use innerHTML for user/server-provided content.
    option.textContent = item.label;

    leaderboardSelect.appendChild(option);
  }

  leaderboardSelect.disabled =
    leaderboardSelect.options.length === 0;
}


// ============================================================
// CONSTRUCT LEADERBOARD URL
// ============================================================

function getLeaderboardUrl(selection) {

  const url = new URL(LEADERBOARD_API_URL);

  if (selection === "total") {

    url.searchParams.set("type", "total");

    return url.toString();
  }

  // Only accept valid mission selections.
  const match = selection.match(
    /^mission:(0|[1-9]|10)$/
  );

  if (!match) {
    throw new Error("Invalid leaderboard selection.");
  }

  const missionId = match[1];

  url.searchParams.set("type", "mission");

  url.searchParams.set("mission", missionId);

  return url.toString();
}


// ============================================================
// RENDER LEADERBOARD
// ============================================================

function renderLeaderboard(entries) {

  // Only hide zero scores on individual mission leaderboards.
  const isIndividualLeaderboard =
    leaderboardSelect.value.startsWith("mission:");

  const visibleEntries = isIndividualLeaderboard
    ? entries.filter(entry => Number(entry.score) > 0)
    : entries;

  // Clear existing table entries.
  leaderboardBody.replaceChildren();

  // Show message if no entries remain.
  if (visibleEntries.length === 0) {

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 3;
    cell.textContent = "No entries yet.";

    row.appendChild(cell);
    leaderboardBody.appendChild(row);

    return;
  }

  let previousScore = null;

  for (const entry of visibleEntries) {

    const row = document.createElement("tr");

    const score = Number(entry.score);

    // --------------------------------------------------------
    // Rank (including tied ranks)
    // --------------------------------------------------------

    const rankCell = document.createElement("td");

    const isTied =
      previousScore !== null &&
      score === previousScore;

    const rank =
      Number.isInteger(entry.rank)
        ? String(entry.rank)
        : "-";

    rankCell.textContent = isTied
      ? `=${rank}`
      : rank;

    previousScore = score;

    // --------------------------------------------------------
    // Display name
    // --------------------------------------------------------

    const nameCell = document.createElement("td");

    nameCell.textContent =
      typeof entry.displayName === "string"
        ? entry.displayName
        : "Unknown player";

    // --------------------------------------------------------
    // Score
    // --------------------------------------------------------

    const scoreCell = document.createElement("td");

    scoreCell.textContent =
      Number.isSafeInteger(score)
        ? score.toLocaleString("en-GB")
        : "0";

    // --------------------------------------------------------
    // Add cells
    // --------------------------------------------------------

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    leaderboardBody.appendChild(row);
  }
}


// ============================================================
// LOAD SELECTED LEADERBOARD
// ============================================================

async function loadSelectedLeaderboard() {

  const requestId = ++leaderboardRequestId;

  leaderboardStatus.textContent = "Loading leaderboard...";

  leaderboardSelect.disabled = true;

  try {

    const selection = leaderboardSelect.value;

    const url = getLeaderboardUrl(selection);

    const data = await fetchLeaderboard(url);

    // Ignore this result if another request has started
    // while we were waiting for the server.

    if (requestId !== leaderboardRequestId) {
      return;
    }

    renderLeaderboard(data.entries);

    leaderboardStatus.textContent =
      data.entries.length === 0
        ? "No entries yet."
        : `${data.entries.length} entries`;

  } catch (error) {

    if (requestId !== leaderboardRequestId) {
      return;
    }

    leaderboardBody.replaceChildren();

    leaderboardStatus.textContent = error.message;

  } finally {

    if (requestId === leaderboardRequestId) {
      leaderboardSelect.disabled = false;
    }

  }
}


// ============================================================
// INITIALISE LEADERBOARD
// ============================================================

async function initialiseLeaderboard() {

  leaderboardStatus.textContent = "Loading leaderboard...";

  try {

    // Initial request retrieves the default total leaderboard
    // AND the list of available dropdown options.

    const url = new URL(LEADERBOARD_API_URL);

    url.searchParams.set("type", "total");

    const data = await fetchLeaderboard(url.toString());

    // Populate dropdown using the server-provided options.
    populateLeaderboardDropdown(data.options);

    // Default to total score.
    leaderboardSelect.value = "total";

    // Display the initial results.
    renderLeaderboard(data.entries);

    leaderboardStatus.textContent =
      data.entries.length === 0
        ? "No entries yet."
        : `${data.entries.length} entries`;

  } catch (error) {

    leaderboardStatus.textContent = error.message;

    leaderboardSelect.disabled = true;

  }
}


// ============================================================
// EVENT LISTENERS
// ============================================================

// Reload leaderboard whenever dropdown changes.

leaderboardSelect.addEventListener(
  "change",
  loadSelectedLeaderboard
);


// Load leaderboard when the page is ready.

initialiseLeaderboard();