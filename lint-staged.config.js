module.exports = {
  "*.{js,ts,tsx}": [`yarn lint:fix`],
  "*.{md,json,yaml}": [`yarn format`],
}
