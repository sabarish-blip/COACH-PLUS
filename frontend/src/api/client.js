export async function generatePlan(payload) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok && response.status !== 207) {
    throw new Error(data.errors?.[0]?.message || "Plan generation failed.");
  }

  return data;
}

export async function fetchLanguagePacks() {
  const response = await fetch("/api/language-packs");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Language packs could not be loaded.");
  }

  return data.packs || [];
}
