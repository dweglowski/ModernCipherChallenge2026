async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem("sessionToken");

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(
    `https://mcc2026leaderboard.cipherchallengekeymaster.workers.dev${path}`,
    {
      ...options,
      headers,
    }
  );
}
