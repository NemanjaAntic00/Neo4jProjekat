const BASE_URL = "http://localhost:8081";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response, defaultMessage) {
  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(defaultMessage);
  }

  return data;
}

export async function fetchGenreRecommendations() {
  const response = await fetch(`${BASE_URL}/api/recommendations/genre`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, "Ne mogu da učitam genre preporuke.");
}

export async function fetchSocialRecommendations() {
  const response = await fetch(`${BASE_URL}/api/recommendations/social`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, "Ne mogu da učitam social preporuke.");
}

export async function fetchCollaborativeRecommendations() {
  const response = await fetch(
    `${BASE_URL}/api/recommendations/collaborative`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse(response, "Ne mogu da učitam collaborative preporuke.");
}
