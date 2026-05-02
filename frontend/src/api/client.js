const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function generatePlan(payload) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON response:", text);
    throw new Error("Server returned non-JSON response");
  }

  if (!response.ok && response.status !== 207) {
    throw new Error(data.errors?.[0]?.message || "Plan generation failed.");
  }

  return data;
}

export async function fetchLanguagePacks() {
  const response = await fetch(`${API_BASE_URL}/api/language-packs`);

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON response:", text);
    throw new Error("Server returned non-JSON response");
  }

  if (!response.ok) {
    throw new Error(data.error || "Language packs could not be loaded.");
  }

  return data.packs || [];
}