const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchLostItems() {
  const response = await fetch(`${API_BASE_URL}/api/lost-items`);
  const data = await response.json();
  return data;
}
