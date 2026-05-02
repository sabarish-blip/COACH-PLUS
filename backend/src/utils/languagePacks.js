import fs from "fs/promises";
import path from "path";

const languagePackRoot = path.resolve(process.cwd(), "language-packs");
const manifestPath = path.join(languagePackRoot, "manifest.json");

export async function listLanguagePacks() {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));

  return Promise.all(
    manifest.map(async (pack) => {
      const packPath = resolvePackFile(pack.file);
      const stats = await fs.stat(packPath);

      return {
        ...pack,
        sizeBytes: stats.size,
        downloadUrl: `/api/language-packs/${pack.id}/download`
      };
    })
  );
}

export async function getLanguagePack(packId) {
  const packs = await listLanguagePacks();
  const pack = packs.find((candidate) => candidate.id === packId);

  if (!pack) {
    const error = new Error("Language pack was not found.");
    error.code = "LANGUAGE_PACK_NOT_FOUND";
    throw error;
  }

  return {
    ...pack,
    absolutePath: resolvePackFile(pack.file)
  };
}

function resolvePackFile(relativeFilePath) {
  const resolvedPath = path.resolve(languagePackRoot, relativeFilePath);

  if (!resolvedPath.startsWith(languagePackRoot)) {
    throw new Error("Invalid language pack path.");
  }

  return resolvedPath;
}
