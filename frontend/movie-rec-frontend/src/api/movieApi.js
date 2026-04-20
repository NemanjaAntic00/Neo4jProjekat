const BASE_URL = "http://localhost:8081";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleTextResponse(response, defaultMessage) {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || defaultMessage);
  }

  return text;
}

export async function fetchAllMovies() {
  const response = await fetch(`${BASE_URL}/api/movies/all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Ne mogu da učitam filmove.");
  }

  return response.json();
}

export async function markMovieAsWatched(movieId) {
  const response = await fetch(`${BASE_URL}/api/movies/watch/${movieId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  return handleTextResponse(response, "Ne mogu da označim film kao gledan.");
}

export async function rateMovie(movieId, score) {
  const response = await fetch(`${BASE_URL}/api/movies/rate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      movieId,
      score,
    }),
  });

  return handleTextResponse(response, "Ne mogu da ocenim film.");
}
