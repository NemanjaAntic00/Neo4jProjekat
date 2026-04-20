const BASE_URL = "http://localhost:8081";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchFriends() {
  const response = await fetch(`${BASE_URL}/api/friends`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Ne mogu da učitam prijatelje.");
  }

  return response.json();
}

export async function searchUsers(query) {
  const response = await fetch(
    `${BASE_URL}/api/friends/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Ne mogu da pretražim korisnike.");
  }

  return response.json();
}

export async function addFriend(friendUsername) {
  const response = await fetch(
    `${BASE_URL}/api/friends/add/${friendUsername}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Ne mogu da dodam prijatelja.");
  }

  return text;
}
