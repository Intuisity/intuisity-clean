const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

const source = fs.readFileSync("src/data/astrologyTips.ts", "utf8");
const compiled = ts.transpile(source, {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2020
});
const moduleShim = { exports: {} };
new Function("require", "module", "exports", compiled)(require, moduleShim, moduleShim.exports);

const { getAstrologyReading } = moduleShim.exports;

assert.equal(getAstrologyReading("03/21/1985", new Date("2026-06-12")).sign.name, "Aries");
assert.equal(getAstrologyReading("12/25/1990", new Date("2026-06-12")).sign.name, "Capricorn");
assert.equal(getAstrologyReading("02/29/2024", new Date("2026-06-12")).tips.length, 1);
assert.ok(getAstrologyReading("02/29/2024", new Date("2026-06-12")).synopsis.length > 80);
assert.ok(getAstrologyReading("02/29/2024", new Date("2026-06-12")).dailyQuestion.includes("?"));
assert.equal(getAstrologyReading("02/29/2023", new Date("2026-06-12")), null);
assert.notDeepEqual(
  getAstrologyReading("06/10/1990", new Date("2026-06-12")).tips,
  getAstrologyReading("06/10/1990", new Date("2026-06-13")).tips
);
assert.equal(
  getAstrologyReading("06/10/1990", new Date("2026-06-12"), "08:30", "Seattle").birthDetailsIncluded,
  true
);
assert.equal(
  getAstrologyReading("06/10/1990", new Date("2026-06-12"), "08:30", "Seattle").chartCalculation,
  "full-birth-chart"
);
assert.equal(
  getAstrologyReading("06/10/1990", new Date("2026-06-12"), "6:51am", "Seattle").chartCalculation,
  "full-birth-chart"
);
assert.equal(
  getAstrologyReading("06/10/1990", new Date("2026-06-12"), "08:30", "Seattle").fullChart.risingSign,
  "Leo"
);
assert.notDeepEqual(
  getAstrologyReading("06/10/1990", new Date("2026-06-12"), "08:30", "Seattle").tips,
  getAstrologyReading("06/10/1990", new Date("2026-06-12"), "18:45", "Miami").tips
);

console.log("Astrology tests passed");
