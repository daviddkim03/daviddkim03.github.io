module.exports = {
  "*.{js,jsx,ts,tsx,json,css}": (filenames) => [
    `biome check --write --no-errors-on-unmatched ${filenames.map((f) => `"${f}"`).join(" ")}`,
  ],
};
