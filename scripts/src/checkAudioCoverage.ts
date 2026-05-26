// AI assisted with the creation of the audio coverage check script.
import fs from "node:fs";
import path from "node:path";

interface ManifestItem {
  sentenceId: number;
  files: Record<string, string>;
}

const projectRoot = path.resolve(process.cwd(), "..");
const manifestPath = path.join(projectRoot, "data/audio-manifests/expected_audio.json");
const audioRoot = path.join(projectRoot, "data/audio");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestItem[];
const missing: Array<{ sentenceId: number; file: string }> = [];

for (const item of manifest) {
  for (const file of Object.values(item.files)) {
    if (!fs.existsSync(path.join(audioRoot, file))) {
      missing.push({ sentenceId: item.sentenceId, file });
    }
  }
}

if (missing.length === 0) {
  console.log("All expected audio files are present.");
} else {
  console.log(`Missing ${missing.length} audio files.`);
  console.log(JSON.stringify(missing.slice(0, 50), null, 2));
}
