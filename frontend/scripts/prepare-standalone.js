const fs = require("fs");
const path = require("path");

const appRoot = process.cwd();
const standaloneDir = path.join(appRoot, ".next", "standalone");

copyIfExists(
  path.join(appRoot, ".next", "static"),
  path.join(standaloneDir, ".next", "static")
);
copyIfExists(path.join(appRoot, "public"), path.join(standaloneDir, "public"));

function copyIfExists(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
}
