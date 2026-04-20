const BASE_URL = "http://localhost:8080";

export async function fetchGenreRecommendations(username) {
  const response = await fetch(
    `${BASE_URL}/api/recommendations/genre/${username}`,
  );
  if (!response.ok) {
    throw new Error("Greška pri učitavanju genre preporuka.");
  }
  return response.json();
}

export async function fetchSocialRecommendations(username) {
  const response = await fetch(
    `${BASE_URL}/api/recommendations/social/${username}`,
  );
  if (!response.ok) {
    throw new Error("Greška pri učitavanju social preporuka.");
  }
  return response.json();
}

export async function fetchCollaborativeRecommendations(username) {
  const response = await fetch(
    `${BASE_URL}/api/recommendations/collaborative/${username}`,
  );
  if (!response.ok) {
    throw new Error("Greška pri učitavanju collaborative preporuka.");
  }
  return response.json();
}
