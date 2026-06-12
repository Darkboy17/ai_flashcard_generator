import fs from "fs";
import path from "path";

const ENV_FILES = [".env", ".env.local"];

export function loadEnvFiles(rootDir = process.cwd()) {
  for (const fileName of ENV_FILES) {
    const filePath = path.join(rootDir, fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const name = trimmedLine.slice(0, separatorIndex).trim();
      const value = unwrapEnvValue(trimmedLine.slice(separatorIndex + 1).trim());

      if (!(name in process.env)) {
        process.env[name] = value;
      }
    }
  }
}

export function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is missing.`);
  }

  return value;
}

export function getJsonEnvFromBase64(name) {
  const encodedValue = getRequiredEnv(name);
  const decodedValue = Buffer.from(encodedValue, "base64").toString("utf-8");

  return JSON.parse(decodedValue);
}

function unwrapEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
