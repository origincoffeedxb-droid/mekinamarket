const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of ["index.html", "styles.css", "app.js", "logo.svg", "privacy.html", "terms.html"]) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
console.log("Static site copied into dist/ for Netlify.");
