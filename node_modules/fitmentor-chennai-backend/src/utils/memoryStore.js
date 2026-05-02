import fs from "fs/promises";
import path from "path";

const memoryFilePath = path.resolve(process.cwd(), "memory.json");

export async function appendMemoryEntry(entry) {
  try {
    const existing = await readMemory();
    existing.push(entry);
    await fs.writeFile(memoryFilePath, JSON.stringify(existing, null, 2), "utf-8");
  } catch (error) {
    const writeError = new Error("Failed to persist memory entry.");
    writeError.code = "MEMORY_WRITE_ERROR";
    writeError.details = error.message;
    throw writeError;
  }
}

export async function readMemory() {
  try {
    const fileContents = await fs.readFile(memoryFilePath, "utf-8");
    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}
